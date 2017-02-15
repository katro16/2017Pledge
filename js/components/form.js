(function (doc, win) {
  "use strict";

  var
    actionNetworkForm = doc.getElementById('action-network-form') || doc.createElement('div');

  function preSubmit() {
    /**
     * Fires up the loading modal and disables the form
     * @return {object} - modal with spinner
     * */

    var
      loadingContainer = doc.createElement('div'),
      loadingCopy = doc.createElement('h2'),
      loadingSpinner = doc.createElement('div');

    loadingSpinner.classList.add('circle-spinner', 'large');
    loadingCopy.textContent = 'Please wait one moment…';

    loadingContainer.classList.add('loading');
    loadingContainer.appendChild(loadingCopy);
    loadingContainer.appendChild(loadingSpinner);

    win.modals.generateModal({
      contents: loadingContainer,
      disableOverlayClick: true
    });

    actionNetworkForm.commit.setAttribute('disabled', true);
  }

  function compilePayloadPetition() {
    /**
     * Compiles FormData to send off to mothership queue
     *
     * @return {FormData} formData
     * */

    var
      tags = JSON.parse(actionNetworkForm['signature[tag_list]'].value),
      formData = new FormData();

    formData.append('guard', '');
    formData.append('hp_enabled', true);
    formData.append('org', 'fftf');
    formData.append('tag', actionNetworkForm.dataset.mothershipTag);
    formData.append('an_tags', JSON.stringify(tags));
    formData.append('an_url', win.location.href);
    formData.append('an_petition', actionNetworkForm.action.replace(/\/signatures\/?/, ''));
    formData.append('member[first_name]', actionNetworkForm['signature[first_name]'].value);
    formData.append('member[email]', actionNetworkForm['signature[email]'].value);
    // formData.append('member[postcode]', actionNetworkForm['signature[zip_code]'].value);
    formData.append('member[country]', 'US');

    return formData;
  }

  function compileFormData() {
    /**
     * Compiles FormData to send off to mothership queue
     *
     * @return {FormData} formData
     * */

    var
      tags = JSON.parse(actionNetworkForm['signature[tag_list]'].value),
      formData = new FormData();

    formData.append('guard', '');
    formData.append('hp_enabled', true);
    formData.append('org', 'fftf');
    formData.append('tag', actionNetworkForm.dataset.mothershipTag);
    formData.append('an_tags', JSON.stringify(tags));
    formData.append('an_url', win.location.href);
    formData.append('an_petition', actionNetworkForm.action.replace(/\/signatures\/?/, ''));
    formData.append('member[first_name]', actionNetworkForm['signature[first_name]'].value);
    formData.append('member[email]', actionNetworkForm['signature[email]'].value);
    // formData.append('member[postcode]', actionNetworkForm['signature[zip_code]'].value);
    formData.append('member[country]', 'US');

    return formData;
  }

  function fireThankYouModal() {
    var modalContent = doc.createElement('div');

    var upperContent = doc.createElement('div');
    upperContent.classList.add('upper');

    var lowerContent = doc.createElement('div');
    lowerContent.classList.add('lower');

    var modalHeadline = doc.createElement('h1');
    modalHeadline.textContent = "Thank you!";  

    var modalSubhead = doc.createElement('h4');
    modalSubhead.textContent = "Help us spread the word.";  

    var modalCopy = doc.createElement('p');
    modalCopy.textContent = "We'll send your signature along, but one more thing first:";

    var twitter = doc.getElementById('footer-tweet').cloneNode();
    twitter.textContent = "Share on Twitter";

    var facebook = doc.getElementById('footer-share').cloneNode();
    facebook.textContent = "Share on Facebook";

    var shareThis = doc.createElement('div');
    shareThis.appendChild(modalSubhead);
    shareThis.appendChild(twitter);
    shareThis.appendChild(facebook);
    shareThis.classList.add('hidden');

    var thanks = doc.createElement('p');
    thanks.textContent = 'Thanks for signing!';
    thanks.classList.add('thanks');

    win.modals.dismissModal();

    function createRadio(options) {
      var groupbox = doc.createElement('fieldset');
      var radiogroup = doc.createElement('fieldset');
      radiogroup.classList.add('radio');

      var radio;
      var button;
      
      if (options.label) {
        groupbox.appendChild(createLabel({
          textContent: "Do you work in tech?"
        }));
      }

      for (var i = 0; i < options.buttons.length; i++) {
        radio = doc.createElement('input');
        radio.type = "radio";

        button = options.buttons[i];

        if (button.id) radio.id = button.id;
        if (options.name) radio.setAttribute('name', options.name);

        if (button.label) {
          radiogroup.appendChild(createLabel({
            input: radio,
            textContent: button.label
          }));
        }

        if (button.value) radio.setAttribute('value', button.value);

        radiogroup.appendChild(radio);
      }

      groupbox.appendChild(radiogroup);

      return groupbox;
    }

    function createInput(options) {
      var input = doc.createElement('input');

      if (options.type) input.type = options.type;
      if (options.id) input.id = options.id;
      if (options.class) input.class = options.class;
      if (options.name) input.name = options.name;
      if (options.placeholder) input.placeholder = options.placeholder;
      if (options.required) input.required = true;

      return input;
    }

    function handleRadio(event) {
      event.currentTarget.control.checked = true;

      tech.classList.add('hidden');
      if (event.currentTarget.control.value === "yes") {
        employerFieldset.classList.remove('hidden');
      } else {
        shareThis.classList.remove('hidden');
      }
    }

    function createLabel(options) {
      var label = doc.createElement('label');

      if (options.input) label.setAttribute('for', options.input.getAttribute('id'));
      if (options.class) label.classList.add(options.class);
      if (options.textContent) label.textContent = options.textContent;

     label.addEventListener('click', handleRadio);

      return label;
    }

    var followupForm = doc.createElement('form');
    followupForm.setAttribute('accept-charset', actionNetworkForm.getAttribute('accept-charset'));
    followupForm.setAttribute('action', actionNetworkForm.getAttribute('action'));
    followupForm.setAttribute('method', 'put');
    followupForm.setAttribute('data-petition-id', actionNetworkForm.getAttribute('data-petition-id'));
    followupForm.setAttribute('data-mothership-tag', actionNetworkForm.getAttribute('data-mothership-tag'));

    var tech = createRadio({
      id: "work-in-tech",
      name: "signature[tech]",
      label: "Do you work in tech?",
      buttons: [
        { id: "work-in-tech-yes", label: "Yes", value: "yes" },
        { id: "work-in-tech-no", label: "No", value: "no" }
      ]
    });

    followupForm.appendChild(tech);

    var employer = createInput({
      type: "text",
      id: "employer",
      name: "signature[employer]",
      placeholder: "Comapny Name",
      class: "visually-hidden"
    });

    var employerFieldset = doc.createElement('fieldset');
    employerFieldset.appendChild(createLabel({
      input: employer,
      content: "For whom?",
      class: "visually-hidden"
    }));
    employerFieldset.appendChild(employer);

    var submit = doc.createElement('input');
    submit.type = "submit";
    submit.classList.add('submit');
    employerFieldset.appendChild(submit);
    employerFieldset.classList.add('hidden');
    followupForm.appendChild(employerFieldset);

    followupForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var submission = new XMLHttpRequest();
      submission.open('PUT', 'https://queue.fightforthefuture.org/action', true);

      /*
      submission.addEventListener('error', handleHelperError);
      submission.addEventListener('load', loadHelperResponse);
      */

      submission.send(compileFormData());
    });

    upperContent.appendChild(modalHeadline);
    upperContent.appendChild(modalCopy);

    lowerContent.appendChild(followupForm);
    lowerContent.appendChild(shareThis);

    modalContent.appendChild(upperContent);
    modalContent.appendChild(lowerContent);

    actionNetworkForm.commit.removeAttribute('disabled');

    win.modals.generateModal({contents: modalContent});

    actionNetworkForm.parentNode.insertBefore(thanks, actionNetworkForm);
  }

  function submitForm(event) {
    /**
     * Submits the form to ActionNetwork or Mothership-Queue
     *
     * @param {event} event - Form submission event
     * */

    event.preventDefault();

    var submission = new XMLHttpRequest();

    /*
    if (actionNetworkForm['signature[zip_code]'].value === '') {
      // Since iOS Safari doesn’t do its goddamn job.
      return;
    }
    */

    preSubmit();
    
    function handleHelperError(e) {
      /**
       * Figures out what to say at just the right moment
       * @param {event|XMLHttpRequest} e - Might be an event, might be a response
       * from an XMLHttpRequest
       * */

      win.modals.dismissModal();

      var
        error = e || {},
        errorMessageContainer = doc.createElement('div'),
        errorMessage = doc.createElement('h2'),
        errorMessageInfo = doc.createElement('p');

      errorMessage.textContent = 'Something went wrong';

      if (error.type) {
        errorMessageInfo.textContent = 'There seems to be a problem somewhere in between your computer and our server. Might not be a bad idea to give it another try.';
      } else if (error.status) {
        errorMessageInfo.textContent = '(the nerdy info is that the server returned a status of "' + error.status + '" and said "' + error.statusText + '".)'
      } else {
        errorMessageInfo.textContent = 'this seems to be a weird error. the nerds have been alerted.';
      }

      errorMessageContainer.appendChild(errorMessage);
      errorMessageContainer.appendChild(errorMessageInfo);

      actionNetworkForm.commit.removeAttribute('disabled');

      win.modals.generateModal({contents: errorMessageContainer});
    }

    function loadHelperResponse() {
      /**
       * Does the thing after we get a response from the API server
       * */

      if (submission.status >= 200 && submission.status < 400) {
        fireThankYouModal();
      } else {
        handleHelperError(submission);
      }
    }

    submission.open('POST', 'https://queue.fightforthefuture.org/action', true);
    submission.addEventListener('error', handleHelperError);
    submission.addEventListener('load', loadHelperResponse);
    submission.send(compilePayloadPetition());
  }

  actionNetworkForm.addEventListener('submit', submitForm);
})(document, window);
