{"filter":false,"title":"speller.c","tooltip":"/pset5/speller/speller.c","undoManager":{"mark":-1,"position":-1,"stack":[[{"start":{"row":0,"column":0},"end":{"row":195,"column":0},"action":"remove","lines":["// Implements a spell-checker","","#include <ctype.h>","#include <stdio.h>","#include <sys/resource.h>","#include <sys/time.h>","","#include \"dictionary.h\"","","// Undefine any definitions","#undef calculate","#undef getrusage","","// Default dictionary","#define DICTIONARY \"dictionaries/large\"","","// Prototype","double calculate(const struct rusage *b, const struct rusage *a);","","int main(int argc, char *argv[])","{","    // Check for correct number of args","    if (argc != 2 && argc != 3)","    {","        printf(\"Usage: ./speller [DICTIONARY] text\\n\");","        return 1;","    }","","    // Structures for timing data","    struct rusage before, after;","","    // Benchmarks","    double time_load = 0.0, time_check = 0.0, time_size = 0.0, time_unload = 0.0;","","    // Determine dictionary to use","    char *dictionary = (argc == 3) ? argv[1] : DICTIONARY;","","    // Load dictionary","    getrusage(RUSAGE_SELF, &before);","    bool loaded = load(dictionary);","    getrusage(RUSAGE_SELF, &after);","","    // Exit if dictionary not loaded","    if (!loaded)","    {","        printf(\"Could not load %s.\\n\", dictionary);","        return 1;","    }","","    // Calculate time to load dictionary","    time_load = calculate(&before, &after);","","    // Try to open text","    char *text = (argc == 3) ? argv[2] : argv[1];","    FILE *file = fopen(text, \"r\");","    if (file == NULL)","    {","        printf(\"Could not open %s.\\n\", text);","        unload();","        return 1;","    }","","    // Prepare to report misspellings","    printf(\"\\nMISSPELLED WORDS\\n\\n\");","","    // Prepare to spell-check","    int index = 0, misspellings = 0, words = 0;","    char word[LENGTH + 1];","","    // Spell-check each word in text","    for (int c = fgetc(file); c != EOF; c = fgetc(file))","    {","        // Allow only alphabetical characters and apostrophes","        if (isalpha(c) || (c == '\\'' && index > 0))","        {","            // Append character to word","            word[index] = c;","            index++;","","            // Ignore alphabetical strings too long to be words","            if (index > LENGTH)","            {","                // Consume remainder of alphabetical string","                while ((c = fgetc(file)) != EOF && isalpha(c));","","                // Prepare for new word","                index = 0;","            }","        }","","        // Ignore words with numbers (like MS Word can)","        else if (isdigit(c))","        {","            // Consume remainder of alphanumeric string","            while ((c = fgetc(file)) != EOF && isalnum(c));","","            // Prepare for new word","            index = 0;","        }","","        // We must have found a whole word","        else if (index > 0)","        {","            // Terminate current word","            word[index] = '\\0';","","            // Update counter","            words++;","","            // Check word's spelling","            getrusage(RUSAGE_SELF, &before);","            bool misspelled = !check(word);","            getrusage(RUSAGE_SELF, &after);","","            // Update benchmark","            time_check += calculate(&before, &after);","","            // Print word if misspelled","            if (misspelled)","            {","                printf(\"%s\\n\", word);","                misspellings++;","            }","","            // Prepare for next word","            index = 0;","        }","    }","","    // Check whether there was an error","    if (ferror(file))","    {","        fclose(file);","        printf(\"Error reading %s.\\n\", text);","        unload();","        return 1;","    }","","    // Close text","    fclose(file);","","    // Determine dictionary's size","    getrusage(RUSAGE_SELF, &before);","    unsigned int n = size();","    getrusage(RUSAGE_SELF, &after);","","    // Calculate time to determine dictionary's size","    time_size = calculate(&before, &after);","","    // Unload dictionary","    getrusage(RUSAGE_SELF, &before);","    bool unloaded = unload();","    getrusage(RUSAGE_SELF, &after);","","    // Abort if dictionary not unloaded","    if (!unloaded)","    {","        printf(\"Could not unload %s.\\n\", dictionary);","        return 1;","    }","","    // Calculate time to unload dictionary","    time_unload = calculate(&before, &after);","","    // Report benchmarks","    printf(\"\\nWORDS MISSPELLED:     %d\\n\", misspellings);","    printf(\"WORDS IN DICTIONARY:  %d\\n\", n);","    printf(\"WORDS IN TEXT:        %d\\n\", words);","    printf(\"TIME IN load:         %.2f\\n\", time_load);","    printf(\"TIME IN check:        %.2f\\n\", time_check);","    printf(\"TIME IN size:         %.2f\\n\", time_size);","    printf(\"TIME IN unload:       %.2f\\n\", time_unload);","    printf(\"TIME IN TOTAL:        %.2f\\n\\n\",","           time_load + time_check + time_size + time_unload);","","    // Success","    return 0;","}","","// Returns number of seconds between b and a","double calculate(const struct rusage *b, const struct rusage *a)","{","    if (b == NULL || a == NULL)","    {","        return 0.0;","    }","    else","    {","        return ((((a->ru_utime.tv_sec * 1000000 + a->ru_utime.tv_usec) -","                  (b->ru_utime.tv_sec * 1000000 + b->ru_utime.tv_usec)) +","                 ((a->ru_stime.tv_sec * 1000000 + a->ru_stime.tv_usec) -","                  (b->ru_stime.tv_sec * 1000000 + b->ru_stime.tv_usec)))","                / 1000000.0);","    }","}",""],"id":2},{"start":{"row":0,"column":0},"end":{"row":158,"column":1},"action":"insert","lines":["#include <ctype.h>","#include <stdbool.h>","#include <stdio.h>","#include <stdlib.h>","#include <string.h>","#include <strings.h>","","#include \"dictionary.h\"","","// Represents a node in a hash table","typedef struct node","{","    char word[LENGTH + 1];","    struct node *next;","}","node;","","","// Number of buckets in hash table 2^16","const unsigned int N = 65536;","","// Hash table","node *table[N];","int wordcount=0;","","","//declare empty head","node *head = NULL;","","// Returns true if word is in dictionary else false","bool check(const char *word)","{","    int length =strlen(word);","    char copy[length+1]; // take a byte extra for NTC","    copy[length] = '\\0'; // necessary to add the ntc after allocating space to it","","// not converting gave errors to :) handles min length (1-char) words","//:) handles max length (45-char) words","//:) handles words with apostrophes properly","//:) spell-checking is case-insensitive",""," for (int i = 0; i < length; i++) // we take the word and LC and save that into copy","    {","        copy[i] = tolower(word[i]);","    }","","","       int hashcode=hash(copy); // get a hashcode for that copy","       node *tmp=table[hashcode]; // take a pointer tmp to point at what that array of hashcode is pointing","       if(tmp==NULL) // if tmp points to null return","       {","           return false;","       }","","       while(tmp!=NULL) // do it until the ll ends","       {","           if(strcasecmp(tmp->word,copy)==0) // check case insesnitive for word in node to our word(copy)","           {","               return true; // if found","           }","","                tmp=tmp->next; // else move to next node, traverse the ll","        }","","       return false; // if not found copy until end","}","","// Hashes word to a number","//  stackoverflow","//https://www.reddit.com/r/cs50/comments/1x6vc8/pset6_trie_vs_hashtable/ this was for a prior one that I altered later to ^","","","unsigned int hash(const char *word)","{","    unsigned long hash = 5381;","","    int c = *word;","","    while (c == *word++)","    {","        hash = ((hash << 5) + hash) + c; /* hash * 33 + c */","    }","    return hash % N;","}","","","// Loads dictionary into memory, returning true if successful else false","bool load(const char *dictionary)","{","   FILE *file=fopen(dictionary,\"r\"); // open dict and read it, pointer to it is file","   if(file==NULL) // if the pointer points to null return","   {","       return false;","   }","   {","       // assign a buffer of size 1 for NTC","      char buffer[LENGTH+1];","       while(fscanf(file,\"%s\",buffer)!=EOF) // until eof","       {","","       node *n=malloc(sizeof(node)); // allot memory for n","          if(n==NULL) // check if memory is alloted","          {","","            fclose(file);","           return false;","          }","","         else // if yes","          {","","              strcpy(n->word,buffer); // copy word from buffer to word field of node n","","           n->next=NULL; // at first the n node points to null","","           unsigned int index =hash(buffer); // hash the word in buffer to get index of array","","           // our current node points to what array is pointing at and then the array points to our node","           // even if our array points to null then this node points to null, it is better than initializing the array to null and then taking if/else","","               n->next=table[index]; // this is done to avoid orphaning rest of the ll","               table[index]=n; // it gets inserted in beginning of ll","","           wordcount++; // increment the word count until eof","","             }","       }","       fclose(file);","       return true;","   }","","","}","","","// Returns number of words in dictionary if loaded else 0 if not yet loaded","unsigned int size(void)","{","    // TODO","    return wordcount; // we had a counter for this in load after word was read,copied and added to ll","}","","// Unloads dictionary from memory, returning true if successful else false","bool unload(void)","{","    for(int i=0;i<N;i++) // loop thru all the arrays","   {","    // tmp1 is like a cursor that points to each node while tmp2 is the pointer that frees the prior node","    node *tmp1=table[i]; // initially tmp1 points to 1st node","    while(tmp1!=NULL) // until end of ll","        {","           node *tmp2 = tmp1; // tmp2 points to what tmp1 points","            tmp1 = tmp1 -> next; // tmp1 points to next node","            free(tmp2); // tmp2 frees the prior node","        }","   }","","    return true;","}"]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":195,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":115,"state":"start","mode":"ace/mode/c_cpp"}},"timestamp":1605174563823,"hash":"f5be30aa8bb2431541cbdd029a4db13a4d1918f0"}