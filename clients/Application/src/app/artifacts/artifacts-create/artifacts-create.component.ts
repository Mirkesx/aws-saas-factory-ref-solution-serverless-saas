/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../products/models/product.interface';
import { ProductService } from '../../products/product.service';
import { Artifact } from '../models/artifact.interface';
import { ArtifactsService } from '../artifacts.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import axios from 'axios';
import { IUppy, UppyFile } from "uppy-store-ngrx";
const Uppy = require("@uppy/core");
const Dashboard = require("@uppy/dashboard");
const AwsS3 = require("@uppy/aws-s3");

interface LineItem {
  product: Product;
  quantity?: number;
}

@Component({
  selector: 'app-artifacts-create',
  templateUrl: './artifacts-create.component.html',
  styles: [
    '.dottedUnderline { bartifact-bottom: 1px dotted; }',
  ]
})
export class ArtifactsCreateComponent implements OnInit {
  artifactForm: FormGroup;
  artifactProducts: LineItem[] = [];
  error: string;
  private uppy: IUppy<any, UppyFile<any>>;
  userData: any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private productSvc: ProductService,
              private artifactSvc: ArtifactsService,
              public oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    this.oidcSecurityService.userData$.subscribe(userData => { this.userData = userData; });

    this.uppy = new Uppy({
      autoProceed: true
    });

    this.uppy
    .use(Dashboard, {
      inline: true,
      target: ".DashboardContainer",
      replaceTargetContent: true,
      maxHeight: 450,
      metaFields: [
        { id: "license", name: "License", placeholder: "specify license" },
        {
          id: "caption",
          name: "Caption",
          placeholder: "describe what the image is about"
        }
      ]
    });
    this.uppy.use(AwsS3, {
      target: "Dashboard",
      getUploadParameters: async (file) => {
        console.log("Username:", this.userData['cognito:username']);
        console.log("tenantId:", this.userData['custom:tenantId']);
        console.log("Before upload:", file);
        const res = await axios.get("https://1zijscu1fh.execute-api.us-east-1.amazonaws.com/uploads", { params: { extension: file.extension, type: file.type, original_name: file.name, username: this.userData['cognito:username'], tenantId: this.userData['custom:tenantId'] } });
        console.log("presignedURL", res.data.uploadURL);
        return {
          method: "PUT",
          url: res.data.uploadURL,
          fields: {
            ...file
          },
          // Provide content type header required by S3
          headers: {
            "Content-Type": file.type
          }
        };
      }
    });
    
    this.uppy.on("file-added", (file) => {
      console.log("Added file", file);
    });
    
    this.uppy.on("upload", (data) => {
      // data object consists of `id` with upload ID and `fileIDs` array
      // with file IDs in current upload
      const { id, fileIDs } = data;
      console.log(`Starting upload ${id} for files ${fileIDs}`);
    });
    
    this.uppy.on("progress", (progress) => {
      // progress: integer (total progress percentage)
      console.log(progress);
    });
    
    this.uppy.on("upload-success", (file, response) => {
      console.log("upload success");
      console.log(file.name, response.uploadURL);
    });
    
    this.uppy.on("complete", (result) => {
      console.log("successful files:", result.successful);
      console.log("failed files:", result.failed);
    });
    
    this.uppy.on("error", (error) => {
      console.error(error.stack);
    });
    
    this.uppy.on("upload-error", (file, error, response) => {
      console.log("error with file:", file.id);
      console.log("error message:", error);
    });

    this.productSvc.fetch().subscribe(products => {
      this.artifactProducts = products.map(p => (
        { product: p }
      ));
    })
    this.artifactForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  add(op: LineItem) {
    const artifactProduct = this.artifactProducts.find(p => p?.product.productId  === op.product.productId);
    this.artifactProducts = this.artifactProducts.map(p => {
      if (p.product?.productId === artifactProduct.product?.productId) {
        p = {
          ...artifactProduct,
          quantity: artifactProduct.quantity ? artifactProduct.quantity + 1 : 1,
        };
      }
      return p;
    });
  }

  remove(op: LineItem) {
    const artifactProduct = this.artifactProducts.find(p => p?.product.productId  === op.product.productId);
    this.artifactProducts = this.artifactProducts.map(p => {
      if (p.product?.productId === artifactProduct.product?.productId) {
        p = {
          ...artifactProduct,
          quantity: artifactProduct.quantity && artifactProduct.quantity > 1 ?
                      artifactProduct.quantity - 1 : undefined,
        };
      }
      return p;
    });
  }

  submit() {
    const val: Artifact = {
      ...this.artifactForm.value,
      artifactProduct: this.artifactProducts
      .filter(p => !!p.quantity)
      .map(p => ({
        productId: p.product.productId,
        price: p.product.price,
        quantity: p.quantity
      })),
    };
    this.artifactSvc.create(val)
      .subscribe(() => {
        this.router.navigate(['artifacts']);
      },
      (err: string) => {
        this.error = err;
      });
  }

  cancel() {
    this.router.navigate(['artifacts']);
  }

}
