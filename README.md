Builds your AMD libraries for use in browsers, and supports AMD-enabled and traditional globals-based environments.

```
npm install bower-amd-dist --save-dev
bower-amd-dist
```

This will read your package.json to determine your main AMD module, builds it using require.js optimizer, then outputs it to the dist location specified by "main" in your bower.json.

It also reads dependencies from your bower.json, and injects them as fake AMD modules when using browser globals.

Use With Grunt
--------------

In your Gruntfile:

```

grunt.loadNpmTasks('bower-amd-dist');

// ...

grunt.registerTask('default', ['bower-amd-dist']);

```
