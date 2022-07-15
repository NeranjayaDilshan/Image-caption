try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = 'si';
  }
  catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
  
  
  var noteTextarea = $('#note-textarea');
  var translate = $('#translate');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  
  var noteContent = '';
  
  var notes = getAllNotes();
  renderNotes(notes);
  recognition.continuous = true;
  recognition.onresult = function (event) {
    var current = event.resultIndex;
  
    var transcript = event.results[current][0].transcript;
  
  
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    if (!mobileRepeatBug) {
      noteContent += transcript;
      noteTextarea.val(noteContent);
      console.log(noteContent);
      $.ajax({
        type: "GET",
        url: "https://www.googleapis.com/language/translate/v2",
        data: { key: "AIzaSyBH4jLasjo3fDRcRSf2VLBQr671VHfI2ic", source: "si", target: "en", q: noteContent },
        dataType: 'jsonp',
        success: function (data) {
          console.log(data.data.translations[0].translatedText);
          translate.val(data.data.translations[0].translatedText)
        },  
        error: function (data) {
          console.log(data);
        }
      });
  
  
    }
  };
  
  recognition.onstart = function () {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
  }
  
  recognition.onspeechend = function () {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
  }
  
  recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
      instructions.text('No speech was detected. Try again.');
    };
  }
  
  
  $('#start-record-btn').on('click', function (e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    recognition.start();
  
  });
  
  
  
  $('#pause-record-btn').on('click', function (e) {
    recognition.stop();
  
    API_KEY = 'AIzaSyBHnr7SmsZrK5kgV3F22ZabAGZYMfOD65k'
  
  
  
    instructions.text('Voice recognition paused.');
  });
  
  noteTextarea.on('input', function () {
    noteContent = $(this).val();
  
  })
  
  
  
  notesList.on('click', function (e) {
    e.preventDefault();
    var target = $(e.target);
  
    
    if (target.hasClass('listen-note')) {
      var content = target.closest('.note').find('.content').text();
      readOutLoud(content);
    }
  
    // Delete note.
    if (target.hasClass('delete-note')) {
      var dateTime = target.siblings('.date').text();
      deleteNote(dateTime);
      target.closest('.note').remove();
    }
  });
  
  
  function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();
  
    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
  
    window.speechSynthesis.speak(speech);
  }
  
  
  
  function renderNotes(notes) {
    var html = '';
    if (notes.length) {
      notes.forEach(function (note) {
        html += `<li class="note">
            <p class="header">
              <span class="date">${note.date}</span>
              <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
              <a href="#" class="delete-note" title="Delete">Delete</a>
            </p>
            <p class="content">${note.content}</p>
          </li>`;
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }
  
  
  
  
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      //   console.log(i)
      //   console.log(key)
  
      if (key.substring(0, 5) == 'note-') {
        notes.push({
          date: key.replace('note-', ''),
          content: localStorage.getItem(localStorage.key(i))
        });
      }
    }
    // console.log(notes)
    return notes;
  }
  
  
  function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
  }