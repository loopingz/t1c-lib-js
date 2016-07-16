/**
 * @author Maarten Casteels
 * @since 2016
 */

import {BeIDCard} from "./Trust1Team/Cards/BeIDCard";
import {connection} from "./Trust1Team/Connection";
import {Config} from "./Trust1Team/Config";
import {Cards} from "./Trust1Team/Cards";

export class Trust1Connector {
    private config: Config;
    private cards: Cards;

    constructor(config: Config) {
        this.config = config || new Config();
        this.cards = new Cards(this.config.connectorUrl);
    }

    public checkForConnector(callback) {
        let p = connection.get("https://localhost:12345/v1/info");
        p.then((result) => {
            return callback(result);
        });
    }

    // card Types
    // card Readers
    public beid(): BeIDCard {
        return this.cards.belgiumElectronicID;
    }
}
