const path = require('path');

const _ = {};
const binarySearch = require(path.resolve(__dirname, 'lib', 'binarySearch'));

//  IDENTITY
_.identity = value => value;

//  FIRST
_.first = (array, n) => {
    // return undefined for non-valid or empty array input
    if (!(typeof array === 'string') && !(Array.isArray(array))) return undefined;
    if (n < 0) return [];
    // return the first element of the array if n is undefined
    if (n === undefined) return array[0];
    // find the first n elements of the array
    let result = array.slice(0, n);
    // split the result if it is a string
    if (typeof result === 'string') return result.split('');
    return result;
};

//  LAST
_.last = (array, n) => {
    // return undefined for non-valid input
    if (!(typeof array === 'string') && !(Array.isArray(array))) return undefined;
    // return the last element of the array if n is undefined
    if (n === undefined) return array[array.length - 1];
    // find the last n elements of the array
    let result = array.slice(array.length - n);
    // split the result if it is a string
    if (typeof result === 'string') result = result.split('');
    return result;
};

//  EACH
_.each = (list, iteratee, context) => {
    context = context || this;

    // loop over each element of the array and call the iteratee with each element
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            iteratee.call(context, list[i], i, list);
        }
    } else {
        // loop over each key-value pair in the list and call the iteratee with each pair
        for (let prop in list) {
            iteratee.call(context, list[prop], prop, list);
        }
    }
};

//  INDEX OF
_.indexOf = (array, value, startingIndex = 0) => {
    // return -1 if no array
    if (!array) return -1;
    // use a binary search if the startingIndex is true
    if (startingIndex === true) return binarySearch(array, value);
    // define the starting index if it is a negative number
    if (startingIndex < 0) startingIndex = array.length + startingIndex;
    // loop over the array and return the index of the first element that equals the value
    for (let i = startingIndex; i < array.length; i++) {
        if (array[i] === value) return i;
    }
    // return -1 if no elements match the value
    return -1;
};

//  FILTER
_.filter = (list, predicate, context) => {
    // create a new result array
    const result = [];
    // return an empty array if list is not defined
    if (!list) return result;
    // loop over each value in the list
    _.each(list, (v, i, l) => {
        // if there is no predicate, add the result
        if (!predicate) result.push(v);
        // if there is a predicate, check the value and if it resolves to true, push it to the result array
        else if (predicate.call(context, v, i, l)) result.push(v);
    }, context);
    return result;
};
//  REJECT
_.reject = (list, predicate, context) => {
    // create a result array
    const result = [];
    // if the list or predicate is not provided, return an empty array
    if (!list || !predicate) return result;
    // loop over each value in the list
    _.each(list, (v, i, l) => {
        // if the predicate resolves to false, push the value to the result array
        if (!(predicate.call(context, v, i, l))) result.push(v);
    }, context);
    return result;
};

//  UNIQ
_.uniq = (list, sorted, iteratee) => {
    // create a new result array
    const result = [];
    // if there is no list, an invalid list, or an object is provided as a list without an iteratee, return an empty array
    if (!list || (!(Array.isArray(list)) && typeof list !== 'string' && !iteratee)) return result;
    // if the iteratee is not given, use identity
    iteratee = iteratee || _.identity;
    // use a faster algorithm if sorted is true
    if (sorted) {
        // loop over each value in the list
        _.each(list, (v, i) => {
            // if the value does not equal the previous value, push it to the result array
            if (i === 0) result.push(v);
            else if (iteratee(v) !== iteratee(list[i - 1])) result.push(v);
        });
    } else {
        // loop over each value in the array
        _.each(list, (v, i, l) => {
            let resInc = false;
            // loop over each value in the result array
            for (let i = 0; i < result.length; i++) {
                // if the value is already included in the result array, set the variable to true
                if (iteratee(result[i]) === iteratee(v, i, l)) resInc = true;
            }
            // if the value is not already included in the result array, push the value to this result array
            if (!resInc) result.push(v);
        });

    }
    return result;
};

//  MAP
_.map = (list, iteratee, context) => {
    context = context || this;
    const result = [];
    _.each(list, (v, i, l) => {
        result.push(iteratee.call(context, v, i, l));
    }, context);
    return result;
};

// CONTAINS
_.contains = (list, value, startingIndex = 0) => {
    // look at each value in an object
    if (typeof list === 'object' && !(Array.isArray(list))) {
        for (let key in list) {
            // if the value matches the defined value return true
            if (list[key] === value) return true;
        }
        return false;
    }
    // call the index of function
    const result = _.indexOf(list, value, startingIndex);
    // return true if the list contains the value
    if (result >= 0) return true;
    return false;
};

//  PLUCK
_.pluck = (list, propertyName) => {
    // return an empty array if no arguments defined
    if (!list || (!Array.isArray(list) && typeof list === 'object')) return [];
    // return an undefined array if no property name is defined
    if (!propertyName) return [undefined];
    const result = [];
    // loop over each element in the list
    _.each(list, (v) => {
        // push the property name of each value to the result array
        result.push(v[propertyName]);
    });
    return result;
};

//  REDUCE
_.reduce = (list, iteratee, memo, context) => {
    context = context || this;
    // if no memo is defined, the first value of the list becomes the memo 
    // and the iteratee is not called on it
    if (Array.isArray(list)) {
        if (memo !== 0 && memo !== '' && !memo) memo = list.shift();
        // loop over each element in the array and call the iteratee on it, returning 
        // the result as the new memo
        _.each(list, (v, i) => {
            memo = iteratee.call(context, memo, list[i], i, list);
        }, context);
    } else {
        for (let key in list) {
            // if no memo is defined, the first value of the list becomes the memo 
            // and the iteratee is not called on it
            if (memo !== 0 && memo !== '' && !memo) memo = list[key];
            // loop over each value in the object and call the iteratee on it, returning
            // the result as the new memo
            else memo = iteratee.call(context, memo, list[key], key, list);
        }
    }
    return memo;
};

//  EVERY
_.every = (list, predicate, context) => {
    // loop over each element in the array, returning false if the predicate is not met
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            if (!(predicate.call(context, list[i]))) return false;
        }
    } else if (typeof list === 'object') {
        // loop over each object value, returning false if the predicate is not met
        for (let key in list) {
            if (!(predicate.call(context, list[key]))) return false;
        }
    }
    // return true if the predicate is not met for all items in the list
    return true;
};

//  SOME
_.some = (list, predicate, context) => {
    // loop over each element in an array list, returning true if one item in the
    // list meets the predicate
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            if (predicate.call(context, list[i])) return true;
        }
    } else if (typeof list === 'object') {
        // loop over each value in an object list, returning true if one item in the
        // list meets the predicate
        for (let key in list) {
            if (predicate.call(context, list[key])) return true;
        }
    }
    // return false if no values meet the predicate
    return false;
};

//  EXTEND
_.extend = function (destination) {
    // loop over the arguments
    for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i];
        // for each object key, assign the value to the destination object
        for (let key in obj) {
            destination[key] = obj[key];
        }
    }
    // return the destination object
    return destination;
};

//  DEFAULTS
_.defaults = function (obj) {
    if (typeof obj === 'object') {
        // loop over the arguments
        for (let i = 1; i < arguments.length; i++) {
            const checkObj = arguments[i];
            // if the key does not exist in the defined object, assign obj[key] to the value
            for (let key in checkObj) {
                if (!(key in obj)) {
                    obj[key] = checkObj[key];
                }
            }
        }
    }
    // return the object
    return obj;
};

//  ONCE
_.once = (fn) => {
    let alreadyCalled = false;
    return function () {
        if (!alreadyCalled) {
            alreadyCalled = true;
            return fn.apply(null, arguments);
        }
    };
};

//  MEMOIZE
_.memoize = (fn, hf) => {
    hf = hf || function () {
        return arguments[0];
    };
    //  returns a new function
    const memoizedFunction = function () {
        const a = hf.apply(null, arguments);
        //  if arg is in cache, return the value from the cache
        if (a in memoizedFunction.cache) return memoizedFunction.cache[a];
        //  if not, calculate the result by calling the function
        let result = fn.apply(null, arguments);
        //  store it in the cache
        memoizedFunction.cache[a] = result;
        //  return the value
        return result;
        // }
    };
    memoizedFunction.cache = {};
    return memoizedFunction;
};

//  SHUFFLE
_.shuffle = (arr) => {
    // prepare string arguments by creating an array
    if (typeof arr === 'string') arr = arr.split('');
    // prepare object arguments by creating an array
    if (typeof arr === 'object' && !(Array.isArray(arr))) {
        const newArr = [];
        for (let key in arr) {
            newArr.push(arr[key]);
        }
        arr = newArr;
    }
    // return an empty array if a non-valid argument is given
    if (!arr || arr.length === 0 || !(Array.isArray(arr))) return [];
    const result = [];
    do {
        //  generate a random number between 0 and the array length
        let randomIndex = ~~(Math.random() * arr.length);
        //  remove the value at that index from the array
        let x = arr[randomIndex];
        arr = arr.slice(0, randomIndex).concat(arr.slice(randomIndex + 1));
        //  push it to the new array
        result.push(x);
    }
    //  stop when the array length reaches 0
    while (arr.length > 0);
    return result;
};

//  INVOKE
_.invoke = (list, methodName, args) => {
    if (!methodName) return undefined;
    // create a new result array
    const result = [];
    if (typeof list === 'object' || typeof list === 'string') {
        // call the function on each element, adding the results to the result array
        _.each(list, v => {
            typeof v[methodName] === 'function'
                ? result.push(v[methodName](args))
                : result.push(undefined);
        });
    }
    return result;
};

//  SORT BY
_.sortBy = (list, iteratee, context) => {
    // define variables
    let listArr, iterated = false;
    // create a new list/array from the parameters, so they do not mutate
    Array.isArray(list) ? listArr = [...list] : listArr = _.defaults({}, list);
    // prepare strings arguments by splitting them
    if (typeof listArr === 'string') listArr = listArr.split('');
    // prepare list arguments by creating an array from their values
    if (typeof listArr === 'object' && !(Array.isArray(listArr))) {
        const newList = [];
        for (let key in listArr) {
            newList.push(listArr[key]);
        }
        listArr = newList;
    }
    // if an iteratee is provided, call the iteratee on each item in the array, 
    // creating a new list of objects containing the original and new values
    if (typeof iteratee === 'function') {
        const newList = [];
        _.each(listArr, (v) => {
            newList.push({ originalValue: v, newValue: iteratee.call(context, v) });
        });
        listArr = newList, iterated = true;
    }
    //  sort the array
    let result = listArr.sort((a, b) => {
        if (iteratee) {
            // if an iteratee has been called, sort according to the new value
            if (iterated) return a.newValue > b.newValue;
            // if the iteratee is the key from the key-value pair, sort according to the value
            return a[iteratee] > b[iteratee];
        }
        // sort an array
        return a > b;
    });
    // if a function has been called, create an array containing the original arguments
    // in their current (sorted) order
    if (iterated) {
        const updatedResult = [];
        _.each(result, v => {
            updatedResult.push(v.originalValue);
        });
        return updatedResult;
    }
    return result;
};
//  ZIP
_.zip = function () {
    const result = [];
    //  find the length of the longest argument
    let longest = 0;
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i].length > longest) longest = arguments[i].length;
    }
    //  create a temporary array containing the arguments at a given index of each array
    for (let j = 0; j < longest; j++) {
        const tempArr = [];
        for (let k = 0; k < arguments.length; k++) {
            tempArr.push(arguments[k][j]);
        }
        // push the temporary array to the result 
        result.push(tempArr);
    }
    return result;
};
//  SORTEDINDEX
_.sortedIndex = (list, value, iteratee) => {
    // return 0 if no iteratee and the array contains an object
    if (!value || (typeof list[0] === 'object' && !(Array.isArray(list[0])) && !iteratee)) return 0;
    // enable a number value to be used if it is inputted as a string or array
    if (!(isNaN(value))) value = +value;
    // transform string lists to an array
    if (typeof list === 'string') list.split('');
    // set the start and end points for the binary search
    let start = 0, end = list.length - 1, mid;
    // use the iteratee if it is a function, or _.identity if not
    const fn = typeof iteratee === 'function' ? iteratee : _.identity;
    // if the iteratee is a property, enable it to be used
    const prop = typeof iteratee === 'string' ? iteratee : null;
    // call an iteratee function to define the search value
    let searchValue = prop ? fn(value[prop]) : fn(value);

    // conduct a binary search for the term
    do {
        mid = ~~((end + start) / 2);
        // return 0 if the search value type is not equal to the list value
        if (typeof searchValue !== typeof fn(list[mid]) && typeof searchValue !== typeof fn(list[mid][prop])) return 0;
        // if the search value equals the list[mid] value and the previous value does not equal the search term return mid
        if (searchValue === fn(list[mid]) || (prop && searchValue === fn(list[mid][prop]))) {
            if (fn(list[mid - 1]) === searchValue || fn(list[mid - 1][prop]) === searchValue) end = mid - 1;
            else return mid;
        }
        // if the search value is greater than the list[mid] value and is less than the following value, return mid + 1
        if (searchValue > fn(list[mid]) || (prop && searchValue > fn(list[mid][prop]))) {
            if (searchValue < fn(list[mid + 1]) || searchValue < fn(list[mid + 1][prop])) return mid + 1;
            else start = mid + 1;
        }
        // if the search value is less than the list[mid] value and is greater than the following value, return mid + 1
        if (searchValue < fn(list[mid]) || (prop && searchValue < fn(list[mid][prop]))) {
            if (searchValue > fn(list[mid - 1]) || searchValue > fn(list[mid - 1][prop])) return mid;
            else end = mid - 1;
        }
        // if the search value is greater than the end value, return the end index + 1
        if (searchValue > fn(list[end]) || (prop && searchValue > fn(list[end][prop]))) return end + 1;
        // if the search value is less than the start value, return the start index
        if (searchValue < fn(list[start]) || (searchValue < fn(list[start][prop]))) return start;
    } while (start <= end);
    return 0;
};

//  FLATTEN
_.flatten = (array, shallow) => {
    // return an empty array if it is not an array or string
    if (!(Array.isArray(array)) && typeof array !== 'string') return [];
    if (array.length < 1) return;
    let result = [];
    // loop over each value in the array
    _.each(array, (v) => {
        // if array[i] is an array, recursively call the function
        if (!shallow && Array.isArray(v)) result = result.concat(_.flatten(v));
        // if shallow is true, only flatten the array one level
        else if (Array.isArray(v)) result = result.concat(v);
        // if array[i] is not an array, push the element to the result
        else result.push(v);
    });
    return result;
};

//  INTERSECTION
_.intersection = function () {
    const result = [];
    for (let i = 0; i < arguments.length; i++) {
        if (Array.isArray(arguments[i]) || typeof arguments[i] === 'string') {
            for (let j = 0; j < arguments[i].length; j++) {
                const includesX = (arr) => arr.includes(arguments[i][j]);
                if (_.every(arguments, includesX) && !(result.includes(arguments[i][j]))) result.push(arguments[i][j]);
            }
        }
    }
    return result;
};

//  DIFFERENCE
_.difference = function () {
    // create an array if the first argument is a string or object
    let result = typeof arguments[0] === 'string' ? arguments[0].split('') : arguments[0];
    if (!Array.isArray(result) && typeof result === 'object') {
        let res = [];
        for (let key in result) {
            res.push(result[key]);
        }
        result = res;
    }
    // ensure the result is an empty array if the argument is not now an array
    result = (Array.isArray(result)) ? result : [];
    // loop over the arguments
    for (let i = 1; i < arguments.length; i++) {
        // if subsequent arguments are arrays check whether the original argument includes each value
        if (Array.isArray(arguments[i])) {
            for (let j = 0; j < arguments[i].length; j++) {
                let index = _.indexOf(result, arguments[i][j]), first = true;
                // if it does, remove it
                while (index >= 0) {
                    let prevIndex = index;
                    index = first ? index : _.indexOf(result, arguments[i][j], prevIndex);
                    first = false;
                    if (index !== -1) result.splice(index, 1);
                }
            }
        }
    }
    // return remaining values from the original array
    return result;
};

if (typeof module !== 'undefined') {
    module.exports = _;
}
