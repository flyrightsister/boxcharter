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

/**
  * Chord and Lyric models.
  * @module chord-lyric
  */
const { Base } = require('./base')

/**
  * Chord object.
  * @class
  */
class Chord extends Base {
  /**
   * Chord constructor
   * @param  {object} data     Object containing chord data corresponding
   *                           to fields in the chord table
   */
  constructor(data) {
    super(data, Chord.fields)
  }
}

Chord.fields = [
  'chordId',
  'measureId',
  'beatIndex',
  'noteCode',
  'suffix',
  'bassNoteCode']

/**
   * Lyric object.
   * @class
   */
class Lyric extends Base {
  /**
  * Lyric constructor
  * @param  {object} data     Object containing lyric data corresponding
  *                           to fields in the lyric table
  */
  constructor(data) {
    super(data, Lyric.fields)
  }
}

Lyric.fields = [
  'lyricId',
  'measureId',
  'verseIndex',
  'lyricText']

module.exports = {
  Chord,
  Lyric,
}
