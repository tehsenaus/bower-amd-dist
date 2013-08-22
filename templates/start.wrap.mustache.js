
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        factory(define);
    } else {
        //Browser globals case.
        var name = '{{ packageName }}',
            defined = {};

        {{# deps }}
        if ( !root['{{ global }}'] ) {
            throw new Error(name + ": Missing dependency: {{ name }}");
        }
        defined['{{ name }}'] = root['{{ global }}'];
        {{/ deps }}

        factory(function (name, deps, factory) {
            var basePath = name.slice(0, name.lastIndexOf('/') + 1);

            for ( var i = 0; i < deps.length; i++ ) {
                var depPath = deps[i];

                if ( depPath[0] == '.' ) {
                    depPath = './' + basePath + depPath.slice(2);
                }
                
                var dep = defined[depPath];
                if (!dep) {
                    throw new Error(name + ": undefined module - " + depPath);
                }
                deps[i] = dep;
            }

            defined['./' + name] = factory.apply(this, deps);
        });

        root.subSync = defined['./{{ packageName }}'];
    }
}(this, function (define) {
    
