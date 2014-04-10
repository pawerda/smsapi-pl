var request = require('request');

function merge(a, b) {
    for (var p in b) {
        try {
            if (b[p].constructor === Object) {
                a[p] = merge(a[p], b[p]);
            } else {
                a[p] = b[p];
            }
        } catch (e) {
            a[p] = b[p];
        }
    }
    return a;
}



var smsAPI = function (config) {
	var defaultConfig = {
        headers: {
            'content-type' : 'application/x-www-form-urlencoded'
        },
        url: 'https://ssl.smsapi.pl/sms.do',
        form:{
    	    username: null,
        	password: null
        }
    };

    if(config && typeof config === 'object'){
        merge(defaultConfig.form, config);
        this.smsapi = defaultConfig;
    }
};


//Publics    
smsAPI.prototype.send = function(message, callback) {

    if(this._isUserValid()){
        merge(message.data, message.options);
        request.post(this._buildForm(message.data), function(error, response, body) {
            if(error){
                callback(new Error(error));
            } else {
                if (body.indexOf('ERROR:') > -1) {
                    //substring(6) - cuts 'ERROR:' string and leaves only error code
                    var code = body.substring(6),
                        message = errors[code];
                    callback(new Error ('Błąd ' + code + ': ' + message));
                } else {
                    callback(null, body);
                }
            }
        });
    } else {
        callback(new Error('smsapi-pl Sender: Username and password is required!'))
    }
    this._clearForm();
    
};

smsAPI.prototype.username = function(username){
    if(typeof username === 'string')
        this.smsapi.form.username = username;
};

smsAPI.prototype.password = function(password){
    if(typeof password === 'string')
        this.smsapi.form.password = password;
};

smsAPI.prototype.url = function(url){
    if(typeof string ==='string')
        this.smsapi.url = url;
};


//Privates
smsAPI.prototype._buildForm = function(data){
    var data_from_config = {'form': this.smsapi.form};
    var data_to_send = {'form': data};
    merge(data_to_send, data_from_config);
    merge(this.smsapi, data_to_send);
    return this.smsapi;
};

smsAPI.prototype._isUserValid = function () {
    return typeof this.smsapi.form.username && typeof this.smsapi.form.password === 'string';
};

smsAPI.prototype._clearForm = function () {
    var temp_form = {username: this.smsapi.form.username,
                     password: this.smsapi.form.password
                    };
    this.smsapi.form = temp_form;       
};


//Error codes
var errors = {
    '8':    'Błąd w odwołaniu (Prosimy zgłośić)',
    '11':   'Zbyt długa lub brak wiadomości lub ustawiono parametr nounicode i pojawiły się znaki specjalne w wiadomości. Dla wysyłki VMS błąd oznacza brak pliku WAV lub treści TTS.',
    '12':   'Wiadomość zawiera ponad 160 znaków (gdy użyty parametr &single=1).',
    '13':   'Brak prawidłowych numerów telefonów (numery błędne, znajdujące się na czarnej liście lub zagraniczne przy wyłączonej opcji wysyłki za granicę).',
    '14':   'Nieprawidłowe pole nadawcy',
    '17':   'Nie można wysłać FLASH ze znakami specjalnymi',
    '18':   'Nieprawidłowa liczba parametrów',
    '19':   'Za dużo wiadomości w jednym odwołaniu',
    '20':   'Nieprawidłowa liczba parametrów IDX',
    '21':   'Wiadomość MMS ma za duży rozmiar (maksymalnie 300kB)',
    '22':   'Błędny format SMIL',
    '23':   'Błąd pobierania pliku dla wiadomości MMS lub VMS',
    '24':   'Błędny format pobieranego pliku',
    '25':   'Parametry &normalize oraz &datacoding nie mogą być używane jednocześnie.',
    '26':   'Za długi temat wiadomości. Temat może zawierać makstymalnie 30 znaków.',
    '27':   'Parametr IDX za długi. Maksymalnie 255 znaków.',
    '30':   'Brak parametru UDH jak podany jest datacoding=bin',
    '31':   'Błąd konwersji TTS',
    '32':   'Nie można wysyłać wiadomości Eco, MMS i VMS na zagraniczne numery.',
    '33':   'Brak poprawnych numerów',
    '35':   'Błędna wartość parametru tts_lector. Dostępne wartości: agnieszka, ewa, jacek, jan, maja',
    '36':   'Nie można wysyłać wiadomości binarnych z ustawioną stopką.',
    '40':   'Brak grupy o podanej nazwie',
    '41':   'Wybrana grupa jest pusta (brak kontaktów w grupie)',
    '50':   'Nie można zaplanować wysyłki na więcej niż 3 miesiące w przyszłość',
    '51':   'Ustawiono błędną godzinę wysyłki, wiadomość VMS mogą być wysyłane tylko pomiędzy godzinami 8 a 22 lub ustawiono kombinację parametrów try i interval powodującą możliwość próby połączenia po godzinie 22.',
    '52':   'Za dużo prób wysyłki wiadomości do jednego numeru (maksymalnie 10 prób w przeciągu 60sek do jednego numeru)',
    '53':   'Nieunikalny parametr idx. Została już przyjęta wiadomość z identyczną wartością parametru idx przy wykorzystaniu parametru &check_idx=1.',
    '54':   'Błędny format daty. Ustawiono sprawdzanie poprawności daty &date_validate=1',
    '55':   'Brak numerów stacjonarnych w wysyłce i ustawiony parametr skip_gsm',
    '56':   'Różnica pomiędzy datą wysyłki a datą wygaśnięcia nie może być mniejsza niż 15 minut i większa niż 12 godzin',
    '57':   'Numer znajduje się na czarnej liście dla danego uzytkownika.',
    '60':   'Grupa kodów o podanej nazwie nie istnieje.',
    '61':   'Data ważności grupy kodów minęła.',
    '62':   'Brak wolnych kodów w podanej grupie (wszystkie kody zostały już wykorzystane).',
    '65':   'Brak wystarczającej liczby kodów rabatowych dla wysyłki. Liczba niewykorzystanych kodów w grupie musi być co najmniej równa liczbie numerów w wysyłce.',
    '66':   'W treści wiadomości brak jest znacznika [%kod%] dla wysyłki z parametrem &discount_group (znacznik taki jest wymagany).',
    '70':   'Błędny adres CALLBACK w parametrze notify_url.',
    '72':   'Parametr notify_url może być używany tylko dla odwołań z jednym numerem (nie może być stosowany dla wysyłek masowych).',
    '101':  'Niepoprawne lub brak danych autoryzacji. UWAGA! Hasło do API może różnić się od hasła do Panelu Klienta.',
    '102':  'Nieprawidłowy login lub hasło',
    '103':  'Brak punktów dla tego użytkownika',
    '104':  'Brak szablonu',
    '105':  'Błędny adres IP (włączony filtr IP dla interfejsu API)',
    '110':  'Usługa (SMS, MMS, VMS lub HLR) nie jest dostępna na danym koncie.',
    '200':  'Nieudana próba wysłania wiadomości, prosimy ponowić odwołanie',
    '201':  'Wewnętrzny błąd systemu (prosimy zgłosić)',
    '202':  'Zbyt duża ilość jednoczesnych odwołań do serwisu, wiadomość nie została wysłana (prosimy odwołać się ponownie)',
    '300':  'Nieprawidłowa wartość pola points (przy użyciu pola points jest wymagana wartość 1)',
    '301':  'Wiadomość o podanym ID nie istnieje lub jest zaplanowana do wysłania w przeciągu najbliższych 60 sekund (nie można usunąć takiej wiadomości)',
    '400':  'Nieprawidłowy ID statusu wiadomości',
    '999':  'Wewnętrzny błąd systemu (prosimy zgłosić)',
    '1000':     'Akcja dostępna tylko dla użytkownika głównego',
    '1001':     'Nieprawidłowa akcja (oczekiwane jedna z add_user, set_user, get_user, credits)',
    '1010':     'Błąd dodawania podużytkownika',
    '1020':     'Błąd edycji konta podużytkownika',
    '1021':     'Brak danych do edycji, przynajmniej jeden parametr musi być edytowany',
    '1030':     'Błąd pobierania danych użytkownika',
    '1032':     'Nie istnieje podużytkownik o podanej nazwie dla danego użytkownika głównego',
    '1100':     'Błąd danych podużytkownika',
    '1110':     'Błędna nazwa tworzonego podużytkownika',
    '1111':     'Nie podano nazwy tworzonego konta podużytkownika',
    '1112':     'Nazwa konta podużytkownika za krótka (minimum 3 znaki)',
    '1113':     'Nazwa konta podużytkownika za długa, łączna długość nazwy podużytkownika wraz z prefiksem użytkownika głównego może mieć maksymalnie 32 znaki',
    '1114':     'W nazwie podużytkownika pojawiły się nidozwolone znaki, dozwolone są litery [A – Z], cyfry [0 – 9] oraz znaki @, -, _ i .',
    '1115':     'Istnieje już podużytkownik o podanej nazwie',
    '1120':     'Błąd hasła dla tworzonego konta podużytkownika',
    '1121':     'Hasło dla tworzonego konta podużytkownika za krótkie',
    '1122':     'Hasło dla tworzonego konta podużytkownika za długie',
    '1123':     'Hasło powinno być zakodowane w MD5',
    '1130':     'Błąd limitu punktów przydzielanego podużytkownikowi',
    '1131':     'Parametr limit powinno zawierać wartość numeryczną',
    '1140':     'Błąd limitu miesięcznego punktów przydzielanego podużytkownikowi',
    '1141':     'Parametr month_limit powinno zawierać wartość numeryczną',
    '1150':     'Błędna wartość parametru senders, dopuszczalne wartości dla tego parametru to 0 lub 1',
    '1160':     'Błędna wartość parametru phonebook, dopuszczalne wartości dla tego parametru to 0 lub 1',
    '1170':     'Błędna wartość parametru active, dopuszczalne wartości dla tego parametru to 0 lub 1',
    '1180':     'Błąd parametru info',
    '1183':     'Zawartość parametru info jest za długa',
    '1190':     'Błąd hasła do interfejsu API dla konta podużytkownika',
    '1192':     'Błędna długość hasła do interfejsu API dla konta podużytkownika (hasło zakodowane w md5 powinno mieć 32 znaki)',
    '1193':     'Hasło do interfejsu powinno zostać podane w formie zakodowanej w md5',
    '2001':     'Nieprawidłowa akcja (oczekiwane jedna z add, status, delete, list)',
    '2010':     'Błąd dodawania pola nadawcy',
    '2030':     'Błąd sprawdzania statusu pola nadawcy',
    '2031':     'Nie istnieje pole nadawcy o podanej nazwie',
    '2060':     'Błąd dodawania domyślnego pola nadawcy',
    '2061':     'Pole nadawcy musi być aktywne, żeby ustawić je jako domyślne',
    '2062':     'Pole nadawcy już jest ustawione jako domyślne',
    '2100':     'Błąd przesyłanych danych',
    '2110':     'Błąd nazwy pola nadawcy',
    '2111':     'Brak nazwy dodawanego pola nadawcy (parametr &add jest pusty)',
    '2112':     'Niepoprawna nazwa pola nadawcy (np. numer telefonu, zawierająca polskie i/lub specjalne znaki lub za długie), pole nadawcy może mieć maksymalnie 11 znaków, dopuszczalne znaki: a-z A-Z 0-9 - . [spacja]',
    '2115':     'Pole o podanej nazwie już istnieje',
    '4000':     'Ogólny błąd operacji na bazie numerów.',
    '4001':     'Usługa nie jest dostępna na danym koncie.',
    '4002':     'Nieprawidłowa operacja.',
    '4003':     'Nieprawidłowe użycie parametru.',
    '4004':     'Za duża wartość parametru limit (np. dla operacji list_contacts maksymalna wartość wyświetlanych rekordów to 200).',
    '4100':     'Ogólny błąd operacji na grupach bazy numerów.',
    '4101':     'Grupa o podanej nazwie nie została znaleziona.',
    '4110':     'Ogólny błąd nazwy grupy bazy numerów.',
    '4111':     'Nieprawidłowa nazwa grupy.',
    '4112':     'Nazwa grupy nie może być pusta.',
    '4113':     'Nazwa grupy za krótka (minimalnie 2 znaki).',
    '4114':     'Nazwa grupy za długa (maksymalnie 32 znaki).',
    '4115':     'W nazwie grupy pojawiły się niedozwolone znaki.',
    '4116':     'Grupa o podanej nazwie już istnieje.',
    '4121':     'Nieprawidłowa wartość parametru Info dla grupy.',
    '4122':     'Za długa wartość pola Info dla grupy (maksymalnie 200 znaków).',
    '4200':     'Ogólny błąd kontaktu bazy numerów.',
    '4201':     'Kontakt o podanej nazwie nie został odnaleziony.',
    '4210':     'Ogólny błąd numeru telefonu przydzielonego do kontaktu.',
    '4211':     'Nieprawidłowy numer.',
    '4212':     'Kontakt musi zawierać numer telefonu.',
    '4213':     'Numer jest za krótki.',
    '4214':     'Numer jest za długi.',
    '4220':     'Błąd Imienia kontaktu.',
    '4221':     'Imię za krótkie (minimum 2 znaki).',
    '4222':     'Imię za długie (maksymalnie 100 znaków).',
    '4230':     'Błąd Nazwiska kontaktu.',
    '4231':     'Nazwisko za krótkie (minimum 2 znaki).',
    '4232':     'Nazwisko za długie (maksymalnie 100 znaków).',
    '4240':     'Błąd pola Info dla kontaktu.',
    '4241':     'Za długa wartość pola Info dla kontaktu (maksymalnie 200 znaków).',
    '4250':     'Błąd adresu e-mail dla kontaktu.',
    '4260':     'Błąd daty urodzenia kontaktu.',
    '4270':     'Błąd grupy dla danego kontaktu.',
    '4271':     'Grupa o podanej nazwie dla nie została znaleziona.',
    '4272':     'Przy operacji na kontaktach wymagana jest nazwa grupy.',
    '4280':     'Błąd płci kontaktu.'
}







module.exports = smsAPI;
