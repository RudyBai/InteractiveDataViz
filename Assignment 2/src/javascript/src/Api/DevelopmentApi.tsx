import Api from "./Api";

export default class DevelopmentApi extends Api {

    public saveMessage(): string {
        return "http://localhost:3001/log";
    }

    public getPosts(): string {
        return "http://localhost:3001/posts";
    }

    getGames(): string {
        return "http://localhost:3001/games";
    }

}
