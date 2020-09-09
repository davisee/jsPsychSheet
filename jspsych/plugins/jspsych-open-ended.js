/**
 * jspsych-open-ended
 * a jspsych plugin for free response survey questions
 *
 * Emily Davis

 */


jsPsych.plugins['open-ended'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'open-ended',
    description: '',
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: undefined,
        description: 'Prompt for the subject to response'
      },
      value: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Value',
        default: "",
        description: 'The string will be used to populate the response field with editable answer.'
      },
      rows: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Rows',
        default: 1,
        description: 'The number of rows for the response text box.'
      },
      columns: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Columns',
        default: 40,
        description: 'The number of columns for the response text box.'
      }
        },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      },
    };

  plugin.trial = function(display_element, trial) {

      if (typeof trial.rows == 'undefined') {
        trial.rows = 1;
      }

      if (typeof trial.columns == 'undefined') {
        trial.columns = 40;
    }
      if (typeof trial.value == 'undefined') {
        trial.value = "";
    }


    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-preamble" class="jspsych-survey-text-preamble"><b>'+trial.preamble+'</b></div><br><br>';
    }
    // add questions
      html += '<p class="jspsych-survey-text">' + trial.prompt + '</p>';
      if(trial.rows == 1){
        html += '<input type="text" name="#jspsych-survey-text-response- " size="'+trial.columns+'" value="'+trial.value+'"></input>';
      } else {
        html += '<textarea name="#jspsych-survey-text-response-" cols="' + trial.columns + '" rows="' + trial.rows + '">'+trial.value+'</textarea>';
      }
      html += '</div><br><br>';


    // add submit button
    html += '<button id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" style= "background-color: #4CAF50";>'+'Continue'+'</button>';
    html += '<br><br><button id="withdraw" class="jspsych-btn jspsych-survey-text">'+'Withdraw from this experiment'+'</button>';

    display_element.innerHTML = html;

    display_element.querySelector('#withdraw').addEventListener('click', function() {
      jsPsych.endExperiment()
    });

    display_element.querySelector('#jspsych-survey-text-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var id = ""
      var val = display_element.querySelector('textarea, input').value;
      var obje = {};
      obje[id] = val;
      Object.assign(question_data, obje);


      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data),
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
