import LoginPageComponent from './components/Login/Login';

interface Props {
    params: any
    searchParams: any
}
export default function LoginPage(prop: Props) {
    const isSignUp = prop.searchParams['signUp'] !== undefined;
    
    return (
        <LoginPageComponent isSignUp={isSignUp} />
    )
}