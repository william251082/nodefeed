interface IConfig {
    googleClientID: string;
    googleClientSecret: string;
    mongoURI: string;
    cookieKey: string;
    JWT_KEY: string;
}

export const config: IConfig = {
  googleClientID:
    '964808011168-29vqsooppd769hk90kjbjm5gld0glssb.apps.googleusercontent.com',
  googleClientSecret: 'KnH-rZC23z4fr2CN4ISK4srN',
  mongoURI: 'mongodb://nodeadv:E7lBhsGsTPTMoJOR@cluster0-shard-00-00-yiuhx.mongodb.net:27017,cluster0-shard-00-01-yiuhx.mongodb.net:27017,cluster0-shard-00-02-yiuhx.mongodb.net:27017/feed?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
  cookieKey: '123123123',
    JWT_KEY: 'thjuyfkjhgfds'
};
