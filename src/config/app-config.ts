import * as configuration from 'config';

export class AppConfig {
    repeatedSequences: number;
    mutationsRequired: number;
    saveResults: boolean;

    constructor(config: any) {
        this.repeatedSequences = config.repeatedSequences;
        this.mutationsRequired = config.mutationsRequired;
        this.saveResults = config.saveResult;
    }
}

// get the app settings from the configuration file
export const appConfig = new AppConfig(configuration.has('app') ? configuration.get('app') : {});
