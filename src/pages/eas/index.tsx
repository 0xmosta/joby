import axios from 'axios';
import { useState, useEffect } from 'react';
import { TransitiveTrustGraph } from "@ethereum-attestation-service/transitive-trust-sdk";
import { ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react';

interface Edge {
  id: string;
  src: string;
  dst: string;
  score: number;
}

interface TrustScore {
  positiveScore: number;
  negativeScore: number;
  netScore: number;
}

const EASIndexPage = () => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [trustScores, setTrustScores] = useState<{ [key: string]: { [key: string]: TrustScore } }>({});
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const [newEdge, setNewEdge] = useState<{ src: string; dst: string; score: string }>({
    src: '',
    dst: '',
    score: '',
  });

  const fetchEdges = async () => {
    try {
      const response = await axios.get('http://localhost:8000/edges/');
      setEdges(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching edges:', err);
      setError(err.message || 'An error occurred while fetching data');
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Data:', err.response.data);
          console.error('Status:', err.response.status);
          console.error('Headers:', err.response.headers);
        } else if (err.request) {
          console.error('Request:', err.request);
        } else {
          console.error('Error:', err.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchEdges();
  }, []);

  useEffect(() => {
    if (edges.length > 0) {
      const graph = new TransitiveTrustGraph();
      
      edges.forEach(edge => {
        graph.addEdge(edge.src, edge.dst, edge.score, 0);
      });

      const nodes = Array.from(new Set(edges.flatMap(edge => [edge.src, edge.dst])));
      const scores: { [key: string]: { [key: string]: TrustScore } } = {};
      nodes.forEach(sourceNode => {
        scores[sourceNode] = graph.computeTrustScores(sourceNode, nodes);
      });
      setTrustScores(scores);
    }
  }, [edges]);

  const toggleSource = (source: string) => {
    setExpandedSources(prev => 
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEdge({ ...newEdge, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/edges/', {
        src: newEdge.src,
        dst: newEdge.dst,
        score: parseFloat(newEdge.score),
      });
      setEdges([...edges, response.data]);
      setNewEdge({ src: '', dst: '', score: '' });
    } catch (err) {
      console.error('Error adding new edge:', err);
      setError('Failed to add new edge. Please try again.');
    }
  };

  if (error) {
    return <div className="p-4 text-red-500 bg-red-100 border border-red-400 rounded">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">EAS Trust Scores</h1>
      
      {/* Add New Edge Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Edge</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <input
                type="text"
                name="src"
                value={newEdge.src}
                onChange={handleInputChange}
                placeholder="Source Address"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <input
                type="text"
                name="dst"
                value={newEdge.dst}
                onChange={handleInputChange}
                placeholder="Destination Address"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <input
                type="number"
                name="score"
                value={newEdge.score}
                onChange={handleInputChange}
                placeholder="Score"
                className="w-full p-2 border rounded"
                required
                step="0.01"
                min="0"
                max="1"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-150">
            <Plus className="inline-block mr-2" size={18} />
            Add Edge
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Edge Data</h2>
          <div className="space-y-2">
            {edges.map(edge => (
              <div key={edge.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <span className="font-medium text-blue-600">{truncateAddress(edge.src)}</span>
                <ArrowRight className="text-gray-400" size={18} />
                <span className="font-medium text-green-600">{truncateAddress(edge.dst)}</span>
                <span className="ml-auto font-semibold text-gray-700">Score: {edge.score}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Calculated Trust Scores</h2>
          <div className="space-y-4">
            {Object.entries(trustScores).map(([source, scores]) => (
              <div key={source} className="border border-gray-200 rounded-md">
                <button
                  onClick={() => toggleSource(source)}
                  className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <span className="font-semibold text-gray-700">From {truncateAddress(source)}</span>
                  {expandedSources.includes(source) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSources.includes(source) && (
                  <div className="p-2 space-y-2">
                    {Object.entries(scores)
                      .sort(([, a], [, b]) => b.netScore - a.netScore)
                      .map(([target, score]) => (
                        <div key={`${source}-${target}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium text-gray-600">{truncateAddress(target)}:</span>
                          <div className="text-right">
                            <span className="font-bold text-blue-600">{score.netScore.toFixed(4)}</span>
                            <div className="text-xs text-gray-500">
                              Positive: {score.positiveScore.toFixed(4)}, 
                              Negative: {score.negativeScore.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EASIndexPage;
