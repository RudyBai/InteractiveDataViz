import Api from "./Api";

export default class ProductionApi extends Api {

    public saveMessage(): string {
        return "/log";
    }

    public getPosts(): string {
        return "/posts";
    }

    public getGames(): string {
        return "/games";
    }

}
