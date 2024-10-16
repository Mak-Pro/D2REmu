(function($) {

    const endpoint = 'https://d2emu.com/api/v1/tz';
    const headers = {
        'x-emu-username': 'maksymprokopenko',
        'x-emu-token': 'a26d197f718701cf',
    };


    /*document ready*/
    $(document).ready(function() {

        fetch(endpoint, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    });











    /*window load*/
    $(window).on('load', function() {

    });











    /*window resize*/
    $(window).resize(function() {

    });




})(jQuery);