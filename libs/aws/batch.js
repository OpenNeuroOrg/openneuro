/*eslint no-console: ["error", { allow: ["log"] }] */


export default (aws) => {

    const batch = new aws.Batch();

    return {
        sdk: batch
    };
};