import Api from "./Api";
import DevelopmentApi from "./DevelopmentApi";
import ProductionApi from "./ProductionApi";

export default class ApiFactory {
    static soleInstance: Api;

    public static getInstance() {
        if (!ApiFactory.soleInstance) {
            console.log(process.env.NODE_ENV);
            if (process.env.NODE_ENV === "development") {
                ApiFactory.soleInstance = new DevelopmentApi();
            } else {
                ApiFactory.soleInstance = new ProductionApi();
            }
        }
        return ApiFactory.soleInstance;
    }
}
