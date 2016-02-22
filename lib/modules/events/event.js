class Event {
	constructor(type, data) {
		this.cancelable = false;
		this.propagates = false;

		_.extend(this, data);

		this.type = type.toLowerCase();
		this.timeStamp = Date.now();

		this.target = null;
		this.currentTarget = null;

		this.defaultPrevented = false;
		this.propagationStopped = false;
		this.immediatePropagationStopped = false;
	}

	preventDefault() {
		this.defaultPrevented = true;
	}

	stopPropagation() {
		this.propagationStopped = true;
	}

	stopImmediatePropagation() {
		this.immediatePropagationStopped = true;
		this.stopPropagation();
	}
};

export default Event;