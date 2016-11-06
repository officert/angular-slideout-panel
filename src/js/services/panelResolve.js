//borrowed from https://github.com/angular-ui/bootstrap/blob/master/src/modal/modal.js - $uibResolve

angular.module('angular-slideout-panel').provider('panelResolve', [
  function() {
    this.$get = [
      '$injector',
      '$q',
      ($injector, $q) => {
        return {
          resolve: function(invocables) {
            let promises = [];

            angular.forEach(invocables, value => {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promises.push($q.resolve($injector.invoke(value)));
              } else if (angular.isString(value)) {
                promises.push($q.resolve($injector.get(value)));
              } else {
                promises.push($q.resolve(value));
              }
            });

            return $q.all(promises).then(resolves => {
              let resolveObj = {};
              let resolveIter = 0;

              angular.forEach(invocables, (value, key) => {
                resolveObj[key] = resolves[resolveIter++];
              });

              return resolveObj;
            });
          }
        };
      }
    ];
  }
]);
