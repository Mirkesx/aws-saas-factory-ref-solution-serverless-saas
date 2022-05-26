import { Grid, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type PropTypes = {
  onRightArrowClicked: (newStep: number, newTenantTier: string) => void;
};

function JoinUs(props: PropTypes) {

  const handleClickIndividual = () => {
    props.onRightArrowClicked(1, "Individual");
  }

  const handleClickOrganization = () => {
    props.onRightArrowClicked(1, "Organization");
  }

  return (
    <>
      <Box className="join-us-account-type-box">
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="left"
          alignItems="left"
        >
          <Grid item xs={2}>
            <svg
              className="icon"
              width="50"
              height="48"
              viewBox="0 0 50 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 0L49.7275 17.9656L40.2824 47.0344H9.71758L0.272532 17.9656L25 0Z"
                fill="#1565D8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.7204 28.8874C19.5018 28.106 20.5616 27.667 21.6667 27.667H28.3333C29.4384 27.667 30.4982 28.106 31.2796 28.8874C32.061 29.6688 32.5 30.7286 32.5 31.8337V33.5003C32.5 33.9606 32.1269 34.3337 31.6667 34.3337C31.2064 34.3337 30.8333 33.9606 30.8333 33.5003V31.8337C30.8333 31.1706 30.5699 30.5347 30.1011 30.0659C29.6323 29.5971 28.9964 29.3337 28.3333 29.3337H21.6667C21.0036 29.3337 20.3677 29.5971 19.8989 30.0659C19.4301 30.5347 19.1667 31.1706 19.1667 31.8337V33.5003C19.1667 33.9606 18.7936 34.3337 18.3333 34.3337C17.8731 34.3337 17.5 33.9606 17.5 33.5003V31.8337C17.5 30.7286 17.939 29.6688 18.7204 28.8874Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.9999 19.3337C23.6192 19.3337 22.4999 20.4529 22.4999 21.8337C22.4999 23.2144 23.6192 24.3337 24.9999 24.3337C26.3806 24.3337 27.4999 23.2144 27.4999 21.8337C27.4999 20.4529 26.3806 19.3337 24.9999 19.3337ZM20.8333 21.8337C20.8333 19.5325 22.6987 17.667 24.9999 17.667C27.3011 17.667 29.1666 19.5325 29.1666 21.8337C29.1666 24.1348 27.3011 26.0003 24.9999 26.0003C22.6987 26.0003 20.8333 24.1348 20.8333 21.8337Z"
                fill="white"
              />
            </svg>
          </Grid>
          <Grid item xs={8}>
            <span className="title">Individual</span>
            <span className="description">
              Personal account to manage all you activities.
            </span>
          </Grid>
          <Grid
            container
            item
            xs={2}
            justifyContent="right"
            alignItems="center"
          >
            <ArrowForwardIcon
              className="code-wallet-primary join-us-arrow-right"
              onClick={handleClickIndividual}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className="join-us-account-type-box">
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="left"
          alignItems="left"
        >
          <Grid item xs={2}>
            <svg
              className="icon"
              width="50"
              height="48"
              viewBox="0 0 50 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.09543 18.2329L25 0.865247L48.9046 18.2329L39.7738 46.3344H10.2262L1.09543 18.2329Z"
                stroke="#1565D8"
                strokeWidth="1.4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3333 22.667C17.873 22.667 17.4999 23.0401 17.4999 23.5003V31.8337C17.4999 32.2939 17.873 32.667 18.3333 32.667H31.6666C32.1268 32.667 32.4999 32.2939 32.4999 31.8337V23.5003C32.4999 23.0401 32.1268 22.667 31.6666 22.667H18.3333ZM15.8333 23.5003C15.8333 22.1196 16.9525 21.0003 18.3333 21.0003H31.6666C33.0473 21.0003 34.1666 22.1196 34.1666 23.5003V31.8337C34.1666 33.2144 33.0473 34.3337 31.6666 34.3337H18.3333C16.9525 34.3337 15.8333 33.2144 15.8333 31.8337V23.5003Z"
                fill="#1565D8"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.5655 18.3992C22.0343 17.9304 22.6702 17.667 23.3333 17.667H26.6666C27.3296 17.667 27.9655 17.9304 28.4344 18.3992C28.9032 18.8681 29.1666 19.504 29.1666 20.167V33.5003C29.1666 33.9606 28.7935 34.3337 28.3333 34.3337C27.873 34.3337 27.4999 33.9606 27.4999 33.5003V20.167C27.4999 19.946 27.4121 19.734 27.2558 19.5777C27.0996 19.4215 26.8876 19.3337 26.6666 19.3337H23.3333C23.1122 19.3337 22.9003 19.4215 22.744 19.5777C22.5877 19.734 22.4999 19.946 22.4999 20.167V33.5003C22.4999 33.9606 22.1268 34.3337 21.6666 34.3337C21.2063 34.3337 20.8333 33.9606 20.8333 33.5003V20.167C20.8333 19.504 21.0966 18.8681 21.5655 18.3992Z"
                fill="#1565D8"
              />
            </svg>
          </Grid>
          <Grid item xs={8}>
            <span className="title">Business</span>
            <span className="description">
              Own or belong to a Organization, this is for you.
            </span>
          </Grid>
          <Grid
            container
            item
            xs={2}
            justifyContent="right"
            alignItems="center"
          >
            <ArrowForwardIcon
              className="code-wallet-primary join-us-arrow-right"
              onClick={handleClickOrganization}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default JoinUs;
