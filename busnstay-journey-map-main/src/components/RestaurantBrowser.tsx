import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, Star, Clock, DollarSign, ChevronRight, Loader2, MessageSquare, Phone } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  estimatedTime: string;
  cuisine: string;
  priceLevel: number; // 1-4 ($, $$, $$$, $$$$)
  isOpen: boolean;
  image?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  items: string[];
  total: number;
  status: 'ready' | 'preparing' | 'pending';
  estimatedTime: string;
}

interface RestaurantBrowserProps {
  stationId: string;
  stationName: string;
  onSelect?: (restaurantId: string) => void;
}

// Mock data - replace with real API calls
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Sofia\'s Pizza Kitchen',
    rating: 4.8,
    reviewCount: 324,
    estimatedTime: '20-25 mins',
    cuisine: 'Italian',
    priceLevel: 2,
    isOpen: true,
    image: '🍕',
  },
  {
    id: 'rest-2',
    name: 'Spice Route',
    rating: 4.6,
    reviewCount: 218,
    estimatedTime: '25-30 mins',
    cuisine: 'Indian',
    priceLevel: 2,
    isOpen: true,
    image: '🍛',
  },
  {
    id: 'rest-3',
    name: 'Burger Paradise',
    rating: 4.5,
    reviewCount: 456,
    estimatedTime: '15-20 mins',
    cuisine: 'American',
    priceLevel: 1,
    isOpen: true,
    image: '🍔',
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    orderId: '#ORD-001',
    customerName: 'John Smith',
    items: ['2x Margherita Pizza', '1x Garlic Bread'],
    total: 45.99,
    status: 'ready',
    estimatedTime: 'Ready for pickup',
  },
  {
    id: 'order-2',
    orderId: '#ORD-002',
    customerName: 'Sarah Johnson',
    items: ['1x Spicy Chicken Biryani', '2x Naan'],
    total: 32.50,
    status: 'preparing',
    estimatedTime: '5 mins',
  },
];

const RestaurantBrowser: React.FC<RestaurantBrowserProps> = ({
  stationId,
  stationName,
  onSelect,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setLoadingOrders(true);
    // Simulate API call
    setTimeout(() => {
      setLoadingOrders(false);
    }, 500);
  };

  const PriceDisplay = ({ level }: { level: number }) => (
    <span className="text-xs text-slate-400">
      {Array(level)
        .fill('$')
        .join('')}
    </span>
  );

  if (selectedRestaurant) {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedRestaurant(null)}
          className="text-blue-400 hover:text-blue-300 h-8"
        >
          ← Back to Restaurants
        </Button>

        {/* Restaurant Header */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{selectedRestaurant.image || '🏪'}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white">
                {selectedRestaurant.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-white">
                    {selectedRestaurant.rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({selectedRestaurant.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span>{selectedRestaurant.cuisine}</span>
                <PriceDisplay level={selectedRestaurant.priceLevel} />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedRestaurant.estimatedTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Waiting for Pickup */}
        {loadingOrders ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">
              Orders Ready for Pickup
            </h4>
            {MOCK_ORDERS.length > 0 ? (
              MOCK_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-blue-500/50 transition cursor-pointer"
                  onClick={() => onSelect?.(selectedRestaurant.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {order.orderId}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.customerName}
                      </p>
                    </div>
                    <Badge
                      className={
                        order.status === 'ready'
                          ? 'bg-emerald-600'
                          : 'bg-amber-600'
                      }
                    >
                      {order.status === 'ready' ? '✓ Ready' : '⏱️ Preparing'}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 mb-2">
                    {order.items.join(' + ')}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-400">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {order.estimatedTime}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className="w-full mt-2 h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.(selectedRestaurant.id);
                    }}
                  >
                    Pick Up Order <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                <p>No orders available for pickup at the moment</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setSelectedRestaurant(null)}
                >
                  Try Another Restaurant
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {MOCK_RESTAURANTS.map((restaurant) => (
        <div
          key={restaurant.id}
          className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-amber-500/50 transition cursor-pointer"
          onClick={() => handleSelectRestaurant(restaurant)}
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">{restaurant.image || '🏪'}</div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1">
                {restaurant.name}
              </h4>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-white">
                    {restaurant.rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({restaurant.reviewCount})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 mb-3">
                <span className="bg-slate-800/50 px-2 py-1 rounded">
                  {restaurant.cuisine}
                </span>
                <PriceDisplay level={restaurant.priceLevel} />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {restaurant.estimatedTime}
                </span>
              </div>

              {/* Rider Contact Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Messaging rider for ${restaurant.name}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs font-medium transition"
                  title="Text the rider"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Text Rider</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Calling rider for ${restaurant.name}`);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-medium transition"
                  title="Call the rider"
                >
                  <Phone className="w-3 h-3" />
                </button>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantBrowser;
