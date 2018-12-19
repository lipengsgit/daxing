// import pathToRegexp from 'path-to-regexp';
import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line
// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

const APPROVED_PATH = ['/exception/:id', '/:id*'];

const hasPermission = (pathName) => ((currentAuthority) => {
  const authorities = currentAuthority.split(',').concat(APPROVED_PATH);

  for(let i = 0; i < authorities.length; i += 1) {
    // if (pathToRegexp(authorities[i]).test(pathName)) {
    //   return true;
    // }
    if(authorities[i] === pathName){
      return true;
    }
  }
  return false;
});

const isLogin = () => {
  const authority = getAuthority();
  return authority !== undefined && authority !== null && authority !== '-1';
};

export { reloadAuthorized, hasPermission, isLogin };
export default Authorized;
