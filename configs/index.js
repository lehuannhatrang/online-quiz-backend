import { DevConfig } from './dev.config';
import { DevDockerConfig } from './dev.docker.config';
import { ProdConfig } from './prod.config';
import { CommonConfig } from './common.config';
import { DevOnlineDBConfig } from './dev.onlinedb.config'

let IndexConfig;
if(process.env.NODE_ENV === 'dev-docker') {
    IndexConfig = DevDockerConfig;
}else if(process.env.NODE_ENV === 'dev-onlinedb') {
    IndexConfig = DevOnlineDBConfig;
}
else {
    IndexConfig = (process.env.NODE_ENV === 'production') ? ProdConfig : DevConfig;    
}
export { IndexConfig, CommonConfig }
