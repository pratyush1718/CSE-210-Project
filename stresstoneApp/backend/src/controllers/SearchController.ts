// src/controllers/searchController.ts
import { RequestHandler } from 'express';
import SoundTrack from '../models/SoundTrack';

// SearchQuery interface which requires a search term (q)
// and may optionally include pagination parameters (page and limit).
interface SearchQuery {
  q: string;
  page?: string;
  limit?: string;
}

export const SearchController: RequestHandler<object, unknown, unknown, SearchQuery> = async (req, res) => {
  try {
    const { q, page = '1', limit = '10' } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search term is required' });
      return;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Use $text operator to perform text search
    const results = await SoundTrack.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .collation({ locale: 'en', strength: 2 }); // Case-insensitive search

    res.json({
      results,
      pagination: {
        currentPage: pageNum,
        resultsPerPage: limitNum,
      },
    });
    return;
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
