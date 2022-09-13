export interface Posts {
  id: number;
  cat_id: number;
  tag_id:number;
  title: string;
  slug: string;
  content: string;
  image:string;
  featured:number;
  breaking_news:number;
  status: number;
  user_id: number;
  view:number;
  created_at:Date;
  updated_at:Date;
}
