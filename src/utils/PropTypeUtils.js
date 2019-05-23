// A utility for making a function required if the dependentProp is passed into this component
export function requireFunctionIfPresent(dependentProp) {
    return (props, propName) => {
        if(props[dependentProp]) {
            if (!props[propName]) {
                return new Error(`You must provide '${propName}' if '${dependentProp}' is present`);
            } else if(typeof(props[propName]) !== 'function') {
                return new Error(`The '${propName}' property isn't a function`);
            }
        }
    }
}