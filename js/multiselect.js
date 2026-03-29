/**
 * 自定义多选下拉框组件
 * 实现带复选框的多选功能
 */

class MultiSelectDropdown {
  constructor(selectId, options = {}) {
    this.selectElement = document.getElementById(selectId);
    if (!this.selectElement) {
      console.error(`Element with id ${selectId} not found`);
      return;
    }

    this.options = {
      placeholder: options.placeholder || '请选择',
      maxHeight: options.maxHeight || '200px',
      maxWidth: options.maxWidth || '150px',
      onChange: options.onChange || function() {}
    };

    this.init();
  }

  init() {
    // 隐藏原始select元素
    this.selectElement.style.display = 'none';
    
    // 创建自定义下拉框容器
    this.container = document.createElement('div');
    this.container.className = 'multiselect-container';
    this.selectElement.parentNode.insertBefore(this.container, this.selectElement);

    // 创建下拉框头部
    this.header = document.createElement('div');
    this.header.className = 'multiselect-header';
    this.header.innerHTML = `<span class="placeholder">${this.options.placeholder}</span><span class="arrow">▼</span>`;
    this.container.appendChild(this.header);
    
    // 设置placeholder的样式
    const placeholder = this.header.querySelector('.placeholder');
    placeholder.style.minWidth = '100px';
    placeholder.style.maxWidth = this.options.maxWidth;
    placeholder.style.overflow = 'hidden';
    placeholder.style.textOverflow = 'ellipsis';
    placeholder.style.whiteSpace = 'nowrap';

    // 创建下拉列表容器
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'multiselect-dropdown';
    this.dropdown.style.maxHeight = this.options.maxHeight;
    this.container.appendChild(this.dropdown);

    // 创建复选框列表
    this.createCheckboxes();

    // 添加事件监听
    this.addEventListeners();

    // 初始化选中状态
    this.updateSelection();
  }

  createCheckboxes() {
    const options = this.selectElement.options;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.value === '') continue; // 跳过空值选项

      const item = document.createElement('div');
      item.className = 'multiselect-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = option.value;
      checkbox.id = `multiselect-${this.selectElement.id}-${i}`;
      checkbox.checked = option.selected;
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = option.textContent;
      
      item.appendChild(checkbox);
      item.appendChild(label);
      this.dropdown.appendChild(item);
    }
  }

  addEventListeners() {
    // 点击头部显示/隐藏下拉列表
    this.header.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // 点击复选框更新选中状态
    const checkboxes = this.dropdown.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateSelection();
      });
    });

    // 点击文档其他地方关闭下拉列表
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    if (this.dropdown.classList.contains('show')) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.dropdown.classList.add('show');
    this.header.querySelector('.arrow').textContent = '▲';
  }

  closeDropdown() {
    this.dropdown.classList.remove('show');
    this.header.querySelector('.arrow').textContent = '▼';
  }

  updateSelection() {
    const checkboxes = this.dropdown.querySelectorAll('input[type="checkbox"]');
    const selectedOptions = [];
    const selectedValues = [];
    
    checkboxes.forEach(checkbox => {
      const option = Array.from(this.selectElement.options).find(opt => opt.value === checkbox.value);
      if (option) {
        option.selected = checkbox.checked;
        if (checkbox.checked) {
          selectedOptions.push(option.textContent);
          selectedValues.push(option.value);
        }
      }
    });

    // 更新头部显示
    const placeholder = this.header.querySelector('.placeholder');
    if (selectedOptions.length > 0) {
      placeholder.textContent = selectedOptions.join(', ');
    } else {
      placeholder.textContent = this.options.placeholder;
    }
    
    // 设置最大宽度和文本溢出样式
    placeholder.style.maxWidth = this.options.maxWidth;
    placeholder.style.overflow = 'hidden';
    placeholder.style.textOverflow = 'ellipsis';
    placeholder.style.whiteSpace = 'nowrap';

    // 触发onChange回调
    this.options.onChange(selectedValues);
  }
}