if (SERVER_SIDE){
	var key          = '_request_local_storage_'
	,   cls          = require('continuation-local-storage').createNamespace(key)
	,   bind         = cls.bind.bind(cls)
	,   patch        = func => func(cls)
	,   getContainer = () => cls.get(key)
	,   startRequest = (start) => { cls.run(() => {cls.set(key, []); start()}) }
} else {
	var container    = []
	,   bind         = f  => f
	,   patch        = () => {}
	,   getContainer = () => container
	,   startRequest = () => container = []
}

var namespaces         = 0
,   getCountNamespaces = () => namespaces
,   getNamespace       = () => {

	// This will be our return value.
	var getter = (i => () => {
		var container = getContainer();
		if (!container){
			throw new Error("RLS() access outside of request!");
		}
		return container[i] || (container[i] = {});
	})(namespaces++);

	getter.isActive = () => !!getContainer();

	// This is guarded against old versions of node that don't provide the
	// necessary API (bamboo).
	if (SERVER_SIDE && Object.observe) {

		Object.observe(getter, changes => {

			// It's easy to make the mistake of using `RLS.foo`
			// instead of `RLS().foo`, but this is actually a very
			// bad error server-side.  It's a leak across requests.
			throw new Error(`Use of "RLS.${
				changes[0].name
			}" should be "RLS().${
				changes[0].name
			}"!`);
		});
	}

	return getter;
}

module.exports = { getNamespace, getCountNamespaces, startRequest, bind, patch };
