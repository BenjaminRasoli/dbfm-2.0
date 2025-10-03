export interface ActorsTypes {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
  roles: Roles[];
}

export interface Roles {
  character: string;
  episode_count: number;
  credit_id: string;
}
