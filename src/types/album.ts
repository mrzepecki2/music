// Wspólne typy dla powtarzających się struktur
type WithLabel = { label: string };
type WithAttributes<T> = { attributes: T };

type AlbumImage = WithLabel & WithAttributes<{ height: string }>; 

type AlbumId = WithLabel & WithAttributes<{ 'im:id': string }>;

type AlbumPrice = WithLabel & WithAttributes<{ amount: string; currency: string }>;

type AlbumLink = WithAttributes<{ rel: string; type: string; href: string }>;

interface AlbumContentType {
  'im:contentType': WithAttributes<{ term: string; label: string }>;
  'attributes': { term: string; label: string };
}

type AlbumCategory = WithAttributes<{ 'im:id': string; term: string; scheme: string; label: string }>;

type AlbumReleaseDate = WithLabel & WithAttributes<{ label: string }>;


export interface Album {
  'im:name': WithLabel;
  'im:artist': WithLabel & Partial<WithAttributes<{ href: string }>>;
  'im:image': AlbumImage[];
  'id': AlbumId;
  'im:itemCount': WithLabel;
  'im:price': AlbumPrice;
  'im:contentType': AlbumContentType;
  'rights'?: WithLabel;
  'title': WithLabel;
  'link': AlbumLink;
  'category': AlbumCategory;
  'im:releaseDate': AlbumReleaseDate;
}

// Struktura głównych danych
export interface AlbumsData {
  feed: {
    entry: Album[];
  };
}
