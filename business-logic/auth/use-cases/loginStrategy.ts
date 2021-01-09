export default interface LoginStrategy {
    login(credentials: any): Promise<boolean>;
}