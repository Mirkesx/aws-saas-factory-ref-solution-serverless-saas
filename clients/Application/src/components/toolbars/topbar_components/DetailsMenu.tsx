import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type PropTypes = {
  items: any[];
  isOpen: boolean;
  handleOnClose: () => void;
  anchorEl: HTMLElement;
};

export default function DetailsMenu(props: PropTypes) {
  const { anchorEl, isOpen } = props;
  const width = anchorEl ? anchorEl.offsetWidth : 0;
  return (
    <div>
      <Menu
        id="basic-menu"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={props.handleOnClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props.items.map((item, index) => {
          return (
            <MenuItem
              onClick={item.function}
              key={index}
              style={{ width }}
            >
              {item.title}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
