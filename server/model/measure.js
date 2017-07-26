 /*
  * Copyright (c) 2017 Bonnie Schulkin. All Rights Reserved.
  *
  * This file is part of BoxCharter.
  *
  * BoxCharter is free software: you can redistribute it and/or modify it under
  * the terms of the GNU Affero General Public License as published by the Free
  * Software Foundation, either version 3 of the License, or (at your option)
  * any later version.
  *
  * BoxCharter is distributed in the hope that it will be useful, but WITHOUT
  * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  * FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
  * for more details.
  *
  * You should have received a copy of the GNU Affero General Public License
  * along with BoxCharter. If not, see <http://www.gnu.org/licenses/>.
  *
  */

// model for:
  // measures
  // chords
  // lyrics

var Sequelize = require('Sequelize')
var db = require('./db')
var logger = require('../utilities/log').logger

// var section = require('./section')
var key = require('./note-key')

// for associations
// const Section = section.Section

//////////////////////////////////////////////////////////////////////////////
// Chord
//////////////////////////////////////////////////////////////////////////////

//////////
// table

const Chord = db.sequelize.define('chord', {
 chordId: {
   type: Sequelize.INTEGER,
   autoIncrement: true,
   primaryKey: true,
 },
 beatIndex: {
   type: Sequelize.INTEGER,
   allowNull: false,
 },
 chordSuffix: { type: Sequelize.STRING(8) },
})

Chord.getChordstring = function() {
  // Return a string representing the chord

  return `${this.note_code}${this.chord_suffix}`
}

Chord.setChord = function(chordData) {

  Chord.create(chordData, {
    options: {
      logging: msg => { logger.info(`SEQUELIZE ${msg}`) } }
    })
    .then(newMeasure => {
      logger.debug(`created new chord ${chordData}`)
    })
    .catch(err => {
      throw `Could not create chord ${chordData}: ${err}`
    })
}

///////////
// methods

// def get_chordstring(self):
//     """Return a string representing the chord."""
//
//     chordstring = self.note_code
//     if self.chord_suffix:
//         chordstring += self.chord_suffix
//
//     return chordstring

//////////////////////////////////////////////////////////////////////////////
// Lyric
//////////////////////////////////////////////////////////////////////////////

//////////
// table

const Lyric = db.sequelize.define('lyric', {
  lyricId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  verseIndex: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  lyricText: {
    type: Sequelize.STRING,
  }
})

Lyric.setLyric = function(lyricData) {

  Lyric.create(lyricData, {
    options: {
      logging: msg => { logger.info(`SEQUELIZE ${msg}`) } }
    })
    .then(newMeasure => {
      logger.debug(`created new lyric ${lyricData}`)
    })
    .catch(err => {
      throw `Could not create lyric ${lyricData}: ${err}`
    })
}

////////////////
// associations

// measure_id = db.Column(db.Integer, db.ForeignKey("measures.measure_id"))


//////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////

//////////
// table

const Measure = db.sequelize.define('measure', {
  measureId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // sectionId: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: section.Section,
  //     key: 'sectionId',
  //     allowNull: false,
  //   }
  // },
  index: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  beatsPerMeasure: {
    type: Sequelize.INTEGER
  }
})

////////////////
// associations

// Measure.belongsTo(section.Section, {foreignKey : 'SectionId'})

// Section.hasMany(Measure)  // order_by index

// Measure.hasMany(Chord) // order by beatIndex
// Measure.hasMany(Lyric) // order by verseIndex

// section_id = db.Column(db.Integer,
//     db.ForeignKey("sections.section_id", use_alter=True, name='fk_measure_section_id'))

// section.Section.belongsTo(Measure, {as: 'ending1Start', foreignKey : 'MeasureId'});
// section.Section.belongsTo(Measure, {as: 'ending1End', foreignKey : 'MeasureId'});
// section.Section.belongsTo(Measure, {as: 'ending2Start', foreignKey : 'MeasureId'});

// need to use Measure.hasOne instead of Section.belongsTo, in order to avoid
// circular references
// Measure.hasOne(section.Section, {as: 'ending1Start', foreignKey : 'MeasureId'})
// Measure.hasOne(section.Section, {as: 'ending1End', foreignKey : 'MeasureId'})
// Measure.hasOne(section.Section, {as: 'ending2Start', foreignKey : 'MeasureId'})

Measure.setMeasure = function(measureData) {
  const chords = measureData.chords
  const lyrics = measureData.lyrics
  delete measureData.chords
  delete measureData.lyrics

  Measure.create(measureData, {
    options: {
      logging: msg => { logger.info(`SEQUELIZE ${msg}`) } }
    })
    .then(newMeasure => {
      logger.debug(`created new measure ${measureData}`)
      chords.forEach(c => {
        c.measureId = newMeasure.measureId
        Chord.setChord(c)
      })
      lyrics.forEach(l => {
        l.MeasureId = newMeasure.measureId
        Lyric.setLyrics(l)
      })
    })
    .catch(err => {
      logger.error(
        `Could not create measure ${measureData}: ${err}`)
    })
}

Measure.getSectionMeasures = function(sectionId) {
  Measure.findAll({
    where: { sectionId: sectionId },
    options: { order: ['index'] },
    attributes: { include: ['beatsPerMeasure'] },
    raw: true
  }).then(measures => {
    completeMeasures = measures.map(m => {
      m.chords = m.getChords()
      m.lyrics = m.getLyrics()
      return m
    })
    return Promise.resolve(completeMeasures)
  })
}

Measure.getChords = function() {
  Chord.findAll({
    where: { measureId: this.measureId }})
    .then(chords => {
      const formatChords = {}
      chords.forEach(c => { formatChords[c.beatIndex] = c.chordString() })
      return Promise.resolve(formatChords)
    })
    .catch(err => {
      throw `Could not get chords for measureID ${measureId}: ${err}`
    })
}

Measure.getLyrics = function() {
  Lyric.findAll({ where: { measureId: this.measureId }})
  .then(lyrics => {
    const formatLyrics = {}
    lyrics.forEach(l => { formatLyrics[l.verseIndex] = l.text })
    return Promise.resolve(formatLyrics)
  })
  .catch(err => {
    throw `Could not get chords for measureID ${measureId}: ${err}`
  })
}

////////////////
// chord

Chord.belongsTo(Measure)
Chord.belongsTo(key.Note)
// measure_id = db.Column(db.Integer, db.ForeignKey("measures.measure_id"))
// note_code = db.Column(db.String(2), db.ForeignKey('notes.note_code'))

Lyric.belongsTo(Measure)

// chords = db.relationship("Chord", order_by=Chord.beat_index)
// lyrics = db.relationship("Lyric", order_by=Lyric.verse_index)
// section = db.relationship("Section",
//                           foreign_keys=section_id,
//                           backref='measures',
//                           order_by=index)

///////////
// methods


// def get_data(self):
//     """Return all data for a measure in a JSON-friendly format."""
//
//     measure_data = {'beatsPerMeasure': self.beats_per_measure}
//
//     measure_data['chords'] = { chord.beat_index: chord.get_chordstring() for chord in self.chords }
//     measure_data['lyrics'] = { lyric.verse_index: lyric.lyric_text for lyric in self.lyrics }
//
//     return measure_data
//
// def set_data(self, data):
//     """Set data for the measure from given data dict."""
//
//     self.beats_per_measure = data.get('beatsPerMeasure')
//
//     for index, chordstring in data.get('chords', {}).items():
//
//         # TODO: deal with unparseable chords
//         if chordstring:
//             # ignore empty string (deleted chords)
//             note, suffix = parse_chord(chordstring)
//             chord = Chord(beat_index=index, note_code=note, chord_suffix=suffix)
//             self.chords.append(chord)
//
//     for index, text in data.get('lyrics', {}).items():
//         lyric = Lyric(verse_index=index, lyric_text=text)
//         self.lyrics.append(lyric)
//
//     db.session.add(self)
//     db.session.commit()

module.exports = {
  Measure: Measure,
  Chord: Chord,
  Lyric: Lyric,
}
