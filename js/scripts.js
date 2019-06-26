//wrapping in IIFE
var pokemonRepository = (function() {
  //defining an array of pokemon objects
  var repository = [];
  //API-Adress:
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  //Var to hide/show:
  var $modalContainer = $('#modal-container');


  //add-list-item function:
  function addListItem(pokemon) {
    //creating elements on DOM
    var $p = $('<p>' + pokemon.name + '</p>');
    var $infoButton = $('<button type="button" class="btn btn-secondary">view details</button>');
    var $li = $('<li class="list-group-item"></li>');
    //appending them to DOM
    $li.append($p);
    $li.append($infoButton);
    $('.list-group').append($li);
    $infoButton.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  //showDetails funtion added
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
    //displays details in a modal
    pokemonRepository.showModal(item);
    });
  }

  //add function to add objects into repository
  function add(pokemon) {
    repository.push(pokemon);
  }

  //getAll function:
  function getAll() {
    return repository;
  }

  //load pokemons from API
  function loadList() {
    return $.ajax(apiUrl).then(function (response) {
      response.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  //loading the details into pokemon
  function loadDetails(item) {
    return $.ajax(item.detailsUrl).then(function (response) {
      item.imageUrl = response.sprites.front_default;
      item.height = response.height;
      item.types = response.types.map(function (item) {return ' ' + item.type.name;});
      item.ability = response.abilities.map(function (item) {return ' ' + item.ability.name;});
    }).catch(function (e) {
      console.error(e);
    });
  }

  //show-modal function:
  function showModal(item) {
    $('#modal-container').html('');
    //creating the modal div:
    var modal = $('<div class="modal-dialog"></div>');
    //adding html elements to the modal container:
    var closeButtonElement = $('<button type="button" class="btn btn-secondary">Close</button>'); //closing button
    //eventlistener in jquery format
    closeButtonElement.on('click', hideModal);
    //creating element for name
    var nameElement = $('<h1>' +item.name+ '</h1>');
    //creating element for height
    var heightElement = $('<p>' +'height: ' + item.height + '</p>');
    //creating element for image
    var imageElement = $('<img class="modal-image"></img>');
    imageElement.attr('src',item.imageUrl);    //attribute set in jquery format
    //creating element for type
    var typesElement = $('<p>' +'Type: ' +item.types + '</p>');
    //creating element for abilities
    var abilitiesElement = $('<p>' +'Abilities: ' +item.ability + '</p>');
    var modalContent = $('<div class = "modal-content">');
    modalContent.append(closeButtonElement).append(nameElement).append(imageElement).append(heightElement).append(typesElement).append(abilitiesElement);
    //appending element to modal and modal to modal container
    modal.append(modalContent);
    $modalContainer.append(modal).addClass('is-visible');
  }

//hides modal when 'close' button is clicked
  function hideModal() {
    $('#modal-container').removeClass('is-visible');  //remove class funtion
  }
  //hide modal when ESC on keyboard is pressed down
  $(window).on('keydown', (e) => {
    if (e.key === 'Escape' && $('#modal-container').hasClass('is-visible')) {
      hideModal();
    }
  });
  //hide modal if clicked outside of it  #9
  $('#modal-container').on('click', function (event) {
    if ($(event.target).is($modalContainer)) {
      hideModal();
    }
  });
  //return function:
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal,
  };
})(); //IIFE-Wrapping closed
//loadList promise: loading data from API
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
