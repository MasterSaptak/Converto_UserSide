import { ServiceRegistry } from '../registry';
import { buyForMeConfig } from './buyForMe';
import { medicalConfig } from './medical';
import { exchangeConfig } from './exchange';
import { globalPaymentsConfig } from './globalPayments';
import { educationConfig } from './education';
import { flightsConfig } from './flights';
import { hotelsConfig } from './hotels';
import { trainsConfig } from './trains';
import { busesConfig } from './buses';
import { eventsConfig } from './events';
import { visaConfig } from './visa';

ServiceRegistry.register(buyForMeConfig);
ServiceRegistry.register(medicalConfig);
ServiceRegistry.register(exchangeConfig);
ServiceRegistry.register(globalPaymentsConfig);
ServiceRegistry.register(educationConfig);
ServiceRegistry.register(flightsConfig);
ServiceRegistry.register(hotelsConfig);
ServiceRegistry.register(trainsConfig);
ServiceRegistry.register(busesConfig);
ServiceRegistry.register(eventsConfig);
ServiceRegistry.register(visaConfig);

export { ServiceRegistry };
