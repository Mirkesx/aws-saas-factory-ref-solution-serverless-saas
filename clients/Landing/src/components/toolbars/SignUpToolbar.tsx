import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

type PropTypes = {
    step: number;
    onLeftArrowClicked: (step: number) => void;
}


const info = ["Personal Info.", "Residency Info.", "Bank Verification."];

function SignUpToolbar(props: PropTypes) {
  const handleClick = () => {
    props.onLeftArrowClicked(props.step - 1);
  };

  return (
    <div id="signuptoolbar-container">
      <div id="signuptoolbar-left">
        <ArrowBackIosNewIcon id="back-icon" onClick={handleClick} />
        <span id="back-text">Back</span>
      </div>
      <div id="signuptoolbar-right">
        <p id="step">Step 0{props.step}/03</p>
        <p id="info">{info[props.step - 1]}</p>
      </div>
    </div>
  );
}

export default SignUpToolbar;
