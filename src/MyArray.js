function MyArray(initialCapacity = 3) {
    this.elements = new PlainArray(initialCapacity);
    this._capacity = initialCapacity;
    this._length = 0;
}

MyArray.prototype.grow = function (updatedLength) {
    if(updatedLength === undefined){
        updatedLength = (this._capacity + 1) * 2;
    }

    let tmp = new PlainArray(updatedLength);
    for(let i=0; i<this._capacity; i++){
        tmp.set(i, this.elements.get(i));
    }
    this.elements = tmp;
    this._capacity = updatedLength;
}

MyArray.prototype.length = function () {
    return this._length;
};

MyArray.prototype.push = function (value) {
    if (this._capacity < this.length() + 1){
        this.grow();
    }

    this.elements.set(this.length(), value);
    this._length++;
};

MyArray.prototype.get = function (index) {
    if(index < 0 || index >= (this.length())){
        return undefined;
    }

    return this.elements.get(index);
};

MyArray.prototype.set = function (index, value) {
    if(index > this.length()){
        this.grow((index + 1) * 2);
    }
    this._length = Math.max(index+1, this.length());
    this.elements.set(index, value);
};

MyArray.of = function () {
    let output = new MyArray();

    for(let arg of arguments){
        output.push(arg);
    }
    return output;
};

MyArray.prototype.pop = function () {
    if(this.length() === 0){
        return undefined;
    }

    let output = this.elements.get(this.length()-1);
    this._length--;
    this.elements.set(this.length(), undefined);
    return output;
};

MyArray.prototype.concat = function (other) {
    let output = new MyArray(other.length() + this.length() +1);

    if(this.length === 0 && other.length === 0){
        return output;
    }

    for(let i=0; i< this.length(); i++){
        output.push(this.get(i));
    }

    for(let i=0; i<other.length() ; i++){
        output.push(other.get(i));
    }

    return output;
};

MyArray.prototype.indexOf = function (element) {
    for(let i=0; i<this.length(); i++){
        if(this.elements.get(i) === element){
            return i;
        }
    }
    return -1;
};

MyArray.prototype.lastIndexOf = function (element) {
    for(let i=this.length()-1; i>=0; i--){
        if(this.elements.get(i) === element){
            return i;
        }
    }
    return -1;
};

MyArray.prototype.includes = function (element) {
    return this.indexOf(element) >=0;
};

MyArray.prototype.find = function (fn) {
    let index = this.findIndex(fn);
    return (index >=0) ? this.get(index) : undefined;
};

MyArray.prototype.findIndex = function (fn) {
    for(let i=0; i<this.length(); i++){
        if(fn(this.elements.get(i))){
            return i;
        }
    }
    return -1;
};

MyArray.prototype.equals = function (other) {
    if(this.length() !== other.length()){
        return false;
    }

    for(let i=0; i<this.length(); i++){
        if(this.get(i) != other.get(i)){
            return false;
        }
    }
    return true;
};

MyArray.prototype.forEach = function (fn) {
    for(let i=0; i<this.length(); i++){
        fn(this.elements.get(i),i);
    }
};

MyArray.prototype.join = function (separator = ',') {
    let output = '';

    if(this.length() > 0){
        output = this.get(0);

        for(let i=1; i<this.length(); i++){
            output+= separator + this.elements.get(i);
        }
    }
    return output;
};

MyArray.prototype.toString = function () {
    return this.join();
};

MyArray.prototype.map = function (fn) {
    let output = new MyArray();

    for(let i=0; i<this.length(); i++){
        let element = fn(this.elements.get(i));
        output.push(element);
    }
    return output;
};

MyArray.prototype.filter = function (fn) {
    let output = new MyArray();

    for(let i=0; i<this.length(); i++){
        let element = this.elements.get(i);
        if(fn(element)){
            output.push(element);
        }
    }
    return output;
};

MyArray.prototype.some = function (fn) {
    return this.filter(fn).length() > 0
};

MyArray.prototype.every = function (fn) {
    return this.filter(fn).length() === this.length();
};

MyArray.prototype.fill = function (value, start, end) {
    start = (start === undefined) ? 0 : start;
    end = (end === undefined) ?  this.length() : end;

    for(let i=start; i < end; i++){
        this.elements.set(i,value);
    }
};

MyArray.prototype.reverse = function () {
    for(let i=0; i< this.length()/2; i++){
        let tmp = this.get(i);
        this.set(i, this.get(this.length()-i-1));
        this.set(this.length() - i-1, tmp);
    }
};

MyArray.prototype.shift = function () {
    if(this.length() === 1){
        return this.pop();
    }
    // this is dirty. you should feel bad
    this.reverse();
    let output = this.pop();
    this.reverse();

    return output;
};

MyArray.prototype.unshift = function (element) {
    this.reverse();
    this.push(element);
    this.reverse();
};

MyArray.prototype.slice = function (start, end) {
    start = (start === undefined) ? 0 : start;
    end = (end === undefined) ?  this.length() : end;

    let output = new MyArray(end-start);

    for(let i=0; i < (end-start); i++){
        output.set(i, this.get(start+i));
    }

    return output;
};

MyArray.prototype.splice = function (start, deleteCount) {
    if(deleteCount === undefined){
        deleteCount = this.length() - start;
    }

    let original =  this.concat(new MyArray()); // keep a copy of the original
    this.constructor(); // kind of janky. zeros out of this array

    // add everything from 0 to start
    for(let i=0; i<start; i++){
        this.push(original.get(i));
    }

    // if we have extra arguments then add them
    if(arguments.length > 2){
        for(let i=2; i< arguments.length; i++){
            this.push(arguments[i]);
        }
    }
    // add the remainder of the array
    for(let i=start+deleteCount; i< original.length(); i++){
        this.push(original.get(i));
    }
};