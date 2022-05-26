import '../../css/Topbar.css';
import Logo from './topbar_components/Logo';
import TenantUserDetails from './topbar_components/TenantUserDetails';

function Topbar(props: any) {
  return (
    <div className="topbar">
        <Logo />
        {props.path !== '/login' ? <TenantUserDetails /> : <></>}
    </div>
  );
}

export default Topbar;
