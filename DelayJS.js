/**
 * logger
 * @param {*=} obj
 */
function log(obj) {
  (window.console) && (window.console.log) && (
    window.console.log(obj)
    );
}

/**
 * just like jQuery's $.extend.
 * @param  {Object=} obj
 * @return {Object}
 */
Object.prototype.nExtend = function(obj) {
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      this[key] = obj[key];
    }
  }
  return this;
};


/**
 * DelayJS is an easy to use delayed conditioning.
 *
 * @param {{
     condition_function:      function(...[*]): boolean,
     condition_callback:      function(),
     delay_number:            number=,
     limit_number:            number=,
     limit_callback:          function()=,
     DEBUG_MODE:              boolean=,
     LAST:                    number=,
     NOW:                     number=
    }} args
 * @return {boolean} - true if condition is true, false if limit has reached.
 */
function DelayJS(args) {
  var note, now, condition;

  //mandatory
  if ('function' !== typeof args.condition_function) throw 'error 001: missing \"conditional_function\"!';
  if ('function' !== typeof args.condition_callback) throw 'error 002: missing \"condition_callback\"!';

  args = {}
    .nExtend({              // defaults
      delay_number:   1000,
      limit_number:   1,
      limit_callback: function() {},
      //-----------------------------
      DEBUG_MODE:     false
      //-----------------------------
    })
    .nExtend(args) //          actual data from arguments (overwrite existing)
    .nExtend({ //              maintain last run time-delta
      LAST: args.NOW || 0,
      NOW:  1 * new Date()
    }); // overwrite

  note = 'DEBUG NOTICE: ->DelayJS(*#): '.replace('#', (args.limit_number).toString());

  args.DEBUG_MODE && log(note + ' hello! (~ ' + (0 === args.LAST ? 'first time!' : ('->' + (args.NOW - args.LAST).toString() + ' ms ago')) + ' ~)');

  condition = args.condition_function();

  args.DEBUG_MODE && log(note + ' condition is $$.'.replace('$$', condition.toString()));

  if (true === condition) {
    args.condition_callback();
    return true;
  }


  if (0 === args.limit_number - 1) {
    args.DEBUG_MODE && log(note + ' limit reached.');
    args.limit_callback();
    return false;
  }


  args.DEBUG_MODE && log(note + ' waiting $$ milliseconds.'.replace('$$', args.delay_number));
  args.DEBUG_MODE && log('');

  //delay
  setTimeout(function() {

    //recursive step.
    DelayJS(args.nExtend({
      limit_number: (args.limit_number - 1) //passed all data to next step, but 'limit' which is smaller now.
    }));

  }, args.delay_number);
}

//--- test it ---/

DelayJS({
  condition_function: function() {
    return "hello" === document.title; //you can change this on runtime using console to see the timer stops
  },
  condition_callback: function() {
    console.log('done! yeepppeee!!!!');
  },
  delay_number:       2000,
  limit_number:       3,
  limit_callback:     function() {
    console.log("limit reached!");
  },

  DEBUG_MODE: true
});
