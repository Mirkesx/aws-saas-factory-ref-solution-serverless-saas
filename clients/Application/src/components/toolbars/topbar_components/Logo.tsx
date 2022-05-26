const colors = [
    "#003366",
    "#29ABE2",
    "#0071BC",
    "#003366",
    "#003366",
    "#0071BC",
    "#0071BC",
    "#29ABE2",
    "#003366",
    "#29ABE2",
    "#003366",
    "#29ABE2",
]

function Logo() {
  return (
    <div className="logo">
        <div className='icon'>
            {
                colors.map( (item, index) => {
                    let left = 3 * (index%3) + "px";
                    let top = -7*(Math.floor(index/3)) + "px";
                    return (
                        <div className='circle' style={{backgroundColor: item, left, top}} key={index}></div>
                    )
                })
            }
        </div>
        <div className='title'>Codewallet</div>
    </div>
  );
}

export default Logo;
