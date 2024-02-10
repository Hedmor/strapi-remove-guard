import { getDynamicZoneComponents } from '../diff-helper';
import { StrapiAttribute } from '../types';

describe('getDynamicZoneComponents', () => {
  it('должна находить и возвращать dynamiczone-компоненты', () => {
    const attributes: Record<string, StrapiAttribute> = {
      title: { type: 'string', required: true },
      content: { type: 'richtext' },
      sections: { type: 'dynamiczone', components: ['hero', 'gallery', 'text-block'] },
      footer: { type: 'dynamiczone', components: ['footer-simple', 'footer-advanced'] },
    };

    const result = getDynamicZoneComponents(attributes);

    expect(result.size).toBe(2);
    expect(result.get('sections')).toEqual(['hero', 'gallery', 'text-block']);
    expect(result.get('footer')).toEqual(['footer-simple', 'footer-advanced']);
  });

  it('должна возвращать пустую Map, если dynamiczone нет', () => {
    const attributes: Record<string, StrapiAttribute> = {
      title: { type: 'string' },
      content: { type: 'richtext' },
    };

    const result = getDynamicZoneComponents(attributes);

    expect(result.size).toBe(0);
  });

  it('должна корректно обрабатывать пустой объект', () => {
    const result = getDynamicZoneComponents({});

    expect(result.size).toBe(0);
  });
});
