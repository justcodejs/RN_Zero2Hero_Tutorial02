import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import Helper from '../../lib/helper';
import Sound from 'react-native-sound';

export default WordDefinition = ({def}) => {
  const [loadingMp3, setLoadingMp3] = useState(false);

  let word = Helper.carefullyGetValue(def, ['word']);

  if(word.length > 0) {
    word = Helper.capitalize(word);
    word = '[' + word + ']';
  }
  else {
    word = 'Definition not found.'
  }

  // 20200701 - Oxford API changed the returned JSON structure by introducing a new element call entries after lexicalEntries
  //            This issue is reported by Youtube user Falcon Tan.
  //let speakMp3 = Helper.carefullyGetValue(def, ['results', '0', 'lexicalEntries', '0', 'pronunciations', '0', 'audioFile']);
  let speakMp3 = Helper.carefullyGetValue(def, ['results', '0', 'lexicalEntries', '0', 'entries', '0', 'pronunciations', '0', 'audioFile']);

  return(
    <>
      {
        def &&
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.word}>{word}</Text>
            {
              speakMp3.length > 0 &&
              <View>
              {
                loadingMp3 ?
                <ActivityIndicator size="large" color="#219bd9" style={{marginLeft: 10}} />
                :
                <TouchableOpacity onPress={() => playWord(speakMp3, setLoadingMp3)}>
                  <Text style={styles.speaker}>{'🔈'}</Text>
                </TouchableOpacity>
              }
              </View>
            }
          </View>
          
          <View>
            { getLexicalEntries(def) }
          </View>
        </View>
      }
    </>
  );
}

const playWord = (speakMp3, setLoadingMp3) => {
  setLoadingMp3(true);
  console.log('Playing ', speakMp3);
  // Enable playback in silence mode
  Sound.setCategory('Playback');

  // See notes below about preloading sounds within initialization code below.
  var player = new Sound(speakMp3, null, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      setLoadingMp3(false);
      return;
    }
    
    player.setVolume(1);

    // Play the sound with an onEnd callback
    player.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      setLoadingMp3(false);
      player.release();
    });
  });
}

const getLexicalEntries = (def) => {
  const jsxEntries = [];
  var lexicalEntries = null;

  if(Helper.isNotNullAndUndefined(def, ['results', '0', 'lexicalEntries'])) {
    lexicalEntries = def.results[0].lexicalEntries;

    lexicalEntries.forEach((lexicalItem, index) => {
      jsxEntries.push(
        <View key={'lexicalEntry_' + index} style={styles.lexicalContent}>
          <Text style={styles.category}>{Helper.carefullyGetValue(lexicalItem, ['lexicalCategory','text'], '')}</Text>
          { 
            Helper.isNotNullAndUndefined(lexicalItem, ['entries', '0', 'senses']) &&
            getSenses(lexicalItem.entries[0].senses) 
          }
        </View>
      );
    });
  }

  return (
    <>
      {jsxEntries}
    </>
  );
}

const getSenses = (senses) => {
  const jsxSenses = [];
  
  if(senses && senses.length > 0) {
    senses.forEach((sense, index) => {
      let example = Helper.carefullyGetValue(sense, ['examples', '0', 'text'], '');
      if(example.length > 0)
        example = 'E.g. ' + example;

      if(sense.definitions) { // Only if sense have definition
        jsxSenses.push(
          <View style={styles.row} key={'sense_' + index}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <View style={styles.column}>
              <Text style={styles.definition}>{Helper.carefullyGetValue(sense, ['definitions', '0'], '')}</Text>
              <Text style={styles.example}>{example}</Text>
            </View>
          </View>
        );
      }
    });
  }

  return (
    <View style={{marginLeft: 10}}>{jsxSenses}</View>
  );
}

WordDefinition.propTypes = {
  def: PropTypes.object
};

WordDefinition.defaultProps = {
  def: null
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    paddingBottom: 20
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  speaker: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },
  lexicalContent: {
    paddingTop: 20
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  column: {
    flex: 1,
    flexDirection: 'column'
  },
  bullet: {
    maxWidth: 20,
    minWidth: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },
  definition: {
    fontSize: 18,
    fontWeight: 'normal'
  },
  example: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#999999',
    marginBottom: 10
  }
});
