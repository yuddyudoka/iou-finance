import { useMemo, useState } from 'react';

const categoryLabels = {
  global: 'Shared site content',
  seo: 'SEO and sharing',
  calculator: 'Loan calculator',
  home: 'Homepage',
  servicesPage: 'Services page',
  faqPage: 'FAQ page',
  aboutPage: 'About page',
  contactPage: 'Contact page',
  applicationPage: 'Application page',
  serviceDetail: 'Service detail pages',
  legal: 'Legal pages',
  notFound: '404 page',
};

const longTextKeys = /(?:description|summary|body|answer|quote|statement|intro|outro|consent|help|message|paragraph|text)$/i;
const mediaKeys = new Set(['media', 'image', 'logo', 'socialImage', 'photo', 'icon']);
const isHiddenAssetField = (name) => /(?:icon|logo)$/i.test(String(name));

function humanizeKey(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function blankFromTemplate(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') {
    if ('src' in value && 'alt' in value) {
      return { ...value, src: '', alt: '', position: '50% 50%' };
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blankFromTemplate(item)]));
  }
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

function updateAtPath(source, path, value) {
  const next = clone(source);
  let cursor = next;
  path.slice(0, -1).forEach((segment) => {
    cursor = cursor[segment];
  });
  cursor[path.at(-1)] = value;
  return next;
}

function parsePosition(position = '50% 50%') {
  const [x = '50%', y = '50%'] = String(position).split(/\s+/);
  return [Number.parseInt(x, 10) || 50, Number.parseInt(y, 10) || 50];
}

function MediaEditor({ label, value, path, content, onChange, onUpload, uploadingPath }) {
  const [x, y] = parsePosition(value.position);
  const pathKey = path.join('.');
  const updateMedia = (key, nextValue) => onChange(updateAtPath(content, [...path, key], nextValue));

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file, pathKey);
    if (url) updateMedia('src', url);
    event.target.value = '';
  };

  return (
    <fieldset className="admin-content-group admin-media-editor">
      <legend>{label}</legend>
      <div className="admin-media-layout">
        <div className="admin-media-preview">
          {value.src ? (
            <img src={value.src} alt="" style={{ objectPosition: value.position || '50% 50%' }} />
          ) : <span>No image selected</span>}
        </div>
        <div className="admin-media-controls">
          <label>
            <span>Image URL</span>
            <input value={value.src || ''} onChange={(event) => updateMedia('src', event.target.value)} />
          </label>
          <label className="admin-upload-button">
            {uploadingPath === pathKey ? 'Uploading…' : 'Upload replacement'}
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={Boolean(uploadingPath)} onChange={handleUpload} />
          </label>
          <label>
            <span>Alternative text</span>
            <input value={value.alt || ''} onChange={(event) => updateMedia('alt', event.target.value)} />
          </label>
        </div>
      </div>
      <div className="admin-focal-grid">
        <label>
          <span>Horizontal focal point <b>{x}%</b></span>
          <input type="range" min="0" max="100" value={x} onChange={(event) => updateMedia('position', `${event.target.value}% ${y}%`)} />
        </label>
        <label>
          <span>Vertical focal point <b>{y}%</b></span>
          <input type="range" min="0" max="100" value={y} onChange={(event) => updateMedia('position', `${x}% ${event.target.value}%`)} />
        </label>
      </div>
    </fieldset>
  );
}

function ContentNode({ name, value, path, content, onChange, onUpload, uploadingPath, depth = 0 }) {
  const label = humanizeKey(name);

  if (isHiddenAssetField(name)) return null;

  if (value && typeof value === 'object' && !Array.isArray(value)
    && typeof value.src === 'string' && ('alt' in value || 'position' in value || mediaKeys.has(name))) {
    return <MediaEditor {...{ label, value, path, content, onChange, onUpload, uploadingPath }} />;
  }

  if (Array.isArray(value)) {
    if (!value.length || value.every((item) => typeof item !== 'object')) {
      return (
        <label className="admin-content-field admin-field-full">
          <span>{label}</span>
          <textarea
            rows={Math.max(4, Math.min(10, value.length + 1))}
            value={value.join('\n')}
            onChange={(event) => onChange(updateAtPath(content, path, event.target.value.split('\n').filter(Boolean)))}
          />
          <small>Place each item on a new line.</small>
        </label>
      );
    }

    return (
      <fieldset className="admin-content-group admin-repeatable-group">
        <legend>{label}</legend>
        <div className="admin-repeatable-list">
          {value.map((item, index) => (
            <section className="admin-repeatable-item" key={`${path.join('.')}-${index}`}>
              <div className="admin-repeatable-heading">
                <strong>{item.title || item.question || item.name || `${label} ${index + 1}`}</strong>
                <div>
                  <button type="button" disabled={index === 0} onClick={() => {
                    const reordered = [...value];
                    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                    onChange(updateAtPath(content, path, reordered));
                  }}>Move up</button>
                  <button type="button" disabled={index === value.length - 1} onClick={() => {
                    const reordered = [...value];
                    [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
                    onChange(updateAtPath(content, path, reordered));
                  }}>Move down</button>
                  <button type="button" className="admin-inline-danger" onClick={() => onChange(updateAtPath(content, path, value.filter((_, itemIndex) => itemIndex !== index)))}>Remove</button>
                </div>
              </div>
              <div className="admin-content-fields">
                {Object.entries(item).filter(([childName]) => !isHiddenAssetField(childName)).map(([childName, childValue]) => (
                  <ContentNode
                    key={childName}
                    name={childName}
                    value={childValue}
                    path={[...path, index, childName]}
                    {...{ content, onChange, onUpload, uploadingPath }}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        <button className="admin-button admin-button-secondary admin-add-row" type="button" onClick={() => {
          const template = value[0] || {};
          onChange(updateAtPath(content, path, [...value, blankFromTemplate(template)]));
        }}>Add {label.replace(/s$/i, '')}</button>
      </fieldset>
    );
  }

  if (value && typeof value === 'object') {
    const childEntries = Object.entries(value).filter(([childName]) => !isHiddenAssetField(childName));
    if (!childEntries.length) return null;
    return (
      <fieldset className={`admin-content-group admin-content-group-depth-${Math.min(depth, 2)}`}>
        <legend>{label}</legend>
        <div className="admin-content-fields">
          {childEntries.map(([childName, childValue]) => (
            <ContentNode
              key={childName}
              name={childName}
              value={childValue}
              path={[...path, childName]}
              {...{ content, onChange, onUpload, uploadingPath }}
              depth={depth + 1}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="admin-switch admin-content-switch">
        <input type="checkbox" checked={value} onChange={(event) => onChange(updateAtPath(content, path, event.target.checked))} />
        <span aria-hidden="true" />
        <div><strong>{label}</strong></div>
      </label>
    );
  }

  const isLongText = typeof value === 'string' && (value.length > 90 || longTextKeys.test(name));
  return (
    <label className={`admin-content-field${isLongText ? ' admin-field-full' : ''}`}>
      <span>{label}</span>
      {isLongText ? (
        <textarea rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(event) => onChange(updateAtPath(content, path, event.target.value))} />
      ) : (
        <input type={typeof value === 'number' ? 'number' : 'text'} value={value} onChange={(event) => onChange(updateAtPath(content, path, typeof value === 'number' ? Number(event.target.value) : event.target.value))} />
      )}
    </label>
  );
}

export default function AdminContentEditor({ content, savedContent, onChange, onSave, onUpload, uploadingPath, isSaving }) {
  const categoryKeys = useMemo(() => Object.keys(content).filter((category) => !['global', 'seo', 'calculator'].includes(category)), [content]);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] || 'home');
  const activeCategoryKeys = [selectedCategory];
  const sectionCount = (category) => Object.keys(content[category] || {}).length;
  const hasUnsavedChanges = JSON.stringify(content) !== JSON.stringify(savedContent);

  return (
    <div className="admin-content-workspace">
      <aside className="admin-content-categories" aria-label="Website content categories">
        <div className="admin-panel-heading">
          <div><h2>Website content</h2><p>Edit shared content once or choose a page.</p></div>
        </div>
        <label className="admin-mobile-category-picker">
          <span>Editing page</span>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {categoryKeys.map((category) => (
              <option value={category} key={category}>
                {categoryLabels[category] || humanizeKey(category)} ({sectionCount(category)} sections)
              </option>
            ))}
          </select>
        </label>
        <div className="admin-category-list">
          {categoryKeys.map((category) => (
            <button
              className={category === selectedCategory ? 'admin-category-active' : ''}
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{categoryLabels[category] || humanizeKey(category)}</span>
              <small>{sectionCount(category)} sections</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="admin-editor admin-content-editor" aria-label={`${categoryLabels[selectedCategory] || selectedCategory} editor`}>
        <div className="admin-editor-heading">
          <div>
            <span className={`admin-status admin-status-${hasUnsavedChanges ? 'draft' : 'published'}`}>{hasUnsavedChanges ? 'Unsaved' : 'Saved'}</span>
            <h2>{categoryLabels[selectedCategory] || humanizeKey(selectedCategory)}</h2>
            <p>{hasUnsavedChanges ? 'Review and save your changes to publish them globally.' : 'This content matches the server copy.'}</p>
          </div>
          <button className="admin-button admin-button-primary" type="button" disabled={!hasUnsavedChanges || isSaving} onClick={onSave}>
            {isSaving ? 'Publishing…' : 'Publish changes'}
          </button>
        </div>
        <div className="admin-content-editor-body">
          {activeCategoryKeys.map((categoryKey) => {
            const categoryContent = content[categoryKey];
            if (!categoryContent) return null;
            const nodes = Object.entries(categoryContent).filter(([name]) => !isHiddenAssetField(name)).map(([name, value]) => (
              <ContentNode
                key={`${categoryKey}-${name}`}
                name={name}
                value={value}
                path={[categoryKey, name]}
                {...{ content, onChange, onUpload, uploadingPath }}
              />
            ));
            return nodes;
          })}
        </div>
      </section>
    </div>
  );
}
