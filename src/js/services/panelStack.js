angular.module('angular-slideout-panel').service('angularSlideOutPanelStack', [
  () => {
    class AngularPanelStack {
      constructor() {
        this._stack = [];
      }

      add(panel) {
        if (!panel) return;

        this._stack.push(panel);

        console.log('stack length', this._stack.length);
      }

      remove(panel) {
        if (!panel) return;

        let index = this._stack.indexOf(panel);

        if (index >= 0) this._stack.splice(index, 1);

        console.log('stack length', this._stack.length);
      }

      pop() {
        this._stack.pop();

        console.log('stack length', this._stack.length);
      }

      length() {
        return this._stack.length;
      }
    }

    return new AngularPanelStack();
  }
]);
