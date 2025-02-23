// File: strestoneApp/backend/src/test/seedSoundTracks.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SoundTrack from '../models/SoundTrack';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;

const seedSoundTracks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Sample data with various likes and createdAt for sorting tests
    const tracks = [
      {
        title: 'Sample Track 1',
        description: 'First sample wav track',
        tags: ['sample', 'test'],
        audioUrl: 'testData/music-stubs/sample1.wav',
        likes: 5,
        createdAt: new Date('2023-08-01T10:00:00Z'),
      },
      {
        title: 'Sample Track 2',
        description: 'Second sample wav track',
        tags: ['experiment', 'wav'],
        audioUrl: 'testData/music-stubs/sample2.wav',
        likes: 15,
        createdAt: new Date('2023-08-02T10:00:00Z'),
      },
      {
        title: 'Amazing Beat',
        description: 'A beat that is amazingly rhythmic',
        tags: ['beat', 'rhythm'],
        audioUrl: 'testData/music-stubs/amazingbeat.wav',
        likes: 50,
        createdAt: new Date('2023-08-03T10:00:00Z'),
      },
      {
        title: 'Calm Piano',
        description: 'Soothing piano melody',
        tags: ['piano', 'calm'],
        audioUrl: 'testData/music-stubs/calmpiano.wav',
        likes: 25,
        createdAt: new Date('2023-07-30T10:00:00Z'),
      },
      {
        title: 'Rock Anthem',
        description: 'Loud and energetic rock anthem',
        tags: ['rock', 'anthem'],
        audioUrl: 'testData/music-stubs/rockanthem.wav',
        likes: 40,
        createdAt: new Date('2023-08-04T10:00:00Z'),
      },
    ];

    for (const track of tracks) {
      const newTrack = new SoundTrack(track);
      await newTrack.save();
      console.log(`Inserted ${track.title}`);
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding soundtracks:', error);
    process.exit(1);
  }
};

seedSoundTracks();
