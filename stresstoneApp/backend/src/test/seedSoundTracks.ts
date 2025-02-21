// File: stresstoneApp/backend/src/test/seedSoundTracks.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SoundTrack from '../models/SoundTrack';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;

const seedSoundTracks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    //Sample data
    const tracks = [
      {
        title: "Sample Track 1",
        description: "First sample wav track",
        tags: ["sample", "test"],
        audioUrl: "testData/music-stubs/sample1.wav",
      },
      {
        title: "Sample Track 2",
        description: "Second sample wav track",
        tags: ["experiment", "wav"],
        audioUrl: "testData/music-stubs/sample2.wav",
      },
      // Can add more sample data here
    ];

    for (const track of tracks) {
      const newTrack = new SoundTrack(track);
      await newTrack.save();
      console.log(`Inserted ${track.title}`);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding soundtracks:", error);
    process.exit(1);
  }
};

seedSoundTracks();