/**
 * Mini App type definition matching the StackLive DSL API response
 */
export interface MiniApp {
    id: string;
    name: string;
    description: string;
    launch_url: string;
    icon: string;
    icon_type: 'url' | 'lucide';
    icon_url: string | null;
    gradient: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    categories: string[];
    rating: number | null;
    reviews: number | null;
    creator_id: string;
    creator_email: string;
    status: string;
    deployment_url: string | null;
    last_deployed_at: string | null;
    last_published_at: string | null;
    is_featured: boolean;
    is_new_this_week: boolean;
    is_trending: boolean;
    long_description: string | null;
    tags: string[];
    screenshots: string[];
    features: string[];
    ratings_and_reviews: any;
  }
  
  /**
   * DSL Flow execution response
   */
  export interface FlowExecutionResponse {
    execution: {
      status: 'success' | 'error';
      flowId: string;
      executedAt: number;
      results: {
        [key: string]: {
          status: string;
          executedAt: number;
          intentId: string;
          verb: string;
          resource: string;
          output: {
            apps?: MiniApp[];
            [key: string]: any;
          };
        };
      };
    };
    ui: {
      type: string;
      summary: {
        status: string;
        title: string;
      };
      sections: any[];
      primaryAction: {
        label: string;
        type: string;
      };
    };
  }
  
  /**
   * User profile type
   */
  export interface UserProfile {
    id: string;
    email: string;
    username?: string;
    favoriteApps: string[];
  }

  export default () => null;
  