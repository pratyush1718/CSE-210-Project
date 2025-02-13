// src/controllers/searchController.ts
import { Request, Response } from 'express';
import SoundTrack from '../models/SoundTrack';

interface SearchQuery {
  q: string;
  page?: string;
  limit?: string;
}

export const SearchTracks = async (
  req: Request<{}, {}, {}, SearchQuery>,
  res: Response
) => {
  try {
    const { q, page = '1', limit = '10' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Use $text operator to perform text search
    const results = await SoundTrack.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .collation({ locale: 'en', strength: 2 }); // Case-insensitive search

    res.json({
      results,
      pagination: {
        currentPage: pageNum,
        resultsPerPage: limitNum,
        // if required, you can calculate total pages and total results
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};