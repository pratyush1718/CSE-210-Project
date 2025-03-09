// src/controllers/SearchController.ts
import { RequestHandler } from 'express';
import SoundTrack from '../models/SoundTrack';
import { SortOrder } from 'mongoose';

// SearchQuery interface which requires a search term (q)
// and may optionally include pagination parameters (page and limit).
interface SearchQuery {
  q: string;
  page?: string;
  limit?: string;
  sort?: 'relevance' | 'likes' | 'recent';
}

interface MetaSort {
  $meta: 'textScore';
}

export const SearchController: RequestHandler<object, unknown, unknown, SearchQuery> = async (req, res) => {
  try {
    const { q, page = '1', limit = '10', sort = 'relevance' } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search term is required' });
      return;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let sortCriteria: { [key: string]: SortOrder | { $meta: 'textScore' } } = {};
    if (sort === 'relevance') {
      sortCriteria = { score: { $meta: 'textScore' } };
    } else if (sort === 'likes') {
      sortCriteria = { likes: -1 };
    } else if (sort === 'recent') {
      sortCriteria = { createdAt: -1 };
    }

    // Perform text search and populate creator field (assuming User has a 'name' field)
    const results = await SoundTrack.find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
      .populate('creator', 'name')
      .sort(sortCriteria)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .collation({ locale: 'en', strength: 2 }); // Case-insensitive search

    // Transform results to include streaming URL
    const transformedResults = results.map(track => {
      const trackObj = track.toObject();
      return {
        ...trackObj,
        audioUrl: `/api/audio/stream/${track.audioFileId}`,
      };
    });

    res.json({
      results: transformedResults,
      pagination: {
        currentPage: pageNum,
        resultsPerPage: limitNum,
        totalCount: results.length, // Ideally, get the total count from a separate count query
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};