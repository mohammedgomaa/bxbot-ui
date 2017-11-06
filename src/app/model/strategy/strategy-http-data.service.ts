import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppComponent} from '../../app.component';
import {Strategy} from './strategy.model';
import {StrategyDataService} from './strategy-data.service';
import {AuthenticationService} from '../../shared/authentication.service';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Strategy Data Service.
 *
 * It demonstrates use of Promises in call responses.
 *
 * We chain the toPromise operator to the Observable result of http.get. It converts the Observable into a Promise
 * which is passed back to the caller.
 *
 * Converting to a promise is a good choice when asking http.get to fetch a single chunk of data - when we receive the
 * data, we're done. A single result in the form of a promise is easy for the calling component to understand/consume.
 *
 * @author gazbert
 */
@Injectable()
export class StrategyHttpDataService implements StrategyDataService {

    private strategiesUrl = AppComponent.REST_API_CONFIG_BASE_URL + '/strategies';

    constructor(private http: Http) {
    }

    getAllStrategiesForBotId(botId: string): Promise<Strategy[]> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.strategiesUrl + '?botId=' + botId;
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response.json().data as Strategy[])
            .catch(this.handleError);
    }

    updateStrategy(strategy: Strategy): Promise<Strategy> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.strategiesUrl + '/' + strategy.id;
        return this.http
            .put(url, JSON.stringify(strategy), {headers: headers})
            .toPromise()
            .then(response => response.json().data as Strategy)
            .catch(this.handleError);
    }

    deleteStrategyById(strategyId: string): Promise<boolean> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.strategiesUrl + '/' + strategyId;
        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .then(response => response.status === 200)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
