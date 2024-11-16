from attacks import brute_force,dictionary

def time_calculator(passwords,hs_dict,at,custom_wordlist):


    # Crearea unui string pentru fiecare categorie
    alphabet_types = {'numbers': '0123456789',
                'lowercase_letters': 'abcdefghijklmnopqrstuvwxyz',
                'uppercase_letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                'special_characters': '!@#$%^&*()_+-={}[]:;"\'<>,.?/\\|~`',
                'ascii_extended': '\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0¡¢£¤¥¦§¨©ª«¬\xad®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'}

    alphabet=''
    for a in at:
     alphabet += alphabet_types[a]


    brute_force_results = brute_force(passwords, alphabet)
    dictionary_results = dictionary(passwords,custom_wordlist)

    brute_force_results_list = []
    brute_force_results_dict = {}
    for password in  brute_force_results:

        for key, value in hs_dict.items():

           brute_force_results_dict[key] = int(brute_force_results[password] / value)
        brute_force_results_dict['password']= password
        brute_force_results_list.append(brute_force_results_dict)
        brute_force_results_dict = {}


    dictionary_results_list = []
    dictionary_results_dict = {}
    for password in dictionary_results:

        for key, value in hs_dict.items():
         if dictionary_results[password] >= 0:
            dictionary_results_dict[key] = int( dictionary_results[password] / value)
         else:
            dictionary_results_dict[key] = -1

        dictionary_results_dict['password'] = password
        dictionary_results_list.append(dictionary_results_dict)
        dictionary_results_dict = {}

    return   { "brute_force":brute_force_results_list,"dictionary":dictionary_results_list}

