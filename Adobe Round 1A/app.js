// PDF Outline Extractor Application Logic
class PDFOutlineExtractor {
    constructor() {
        this.currentFile = null;
        this.currentPDF = null;
        this.processingResults = null;
        this.isProcessing = false;
        this.processingStartTime = null;
        this.processingTimer = null;
        this.cancelProcessing = false;
        
        // Sample data for demonstration
        this.sampleData = {
            filename: "machine_learning_guide.pdf",
            title: "Machine Learning: A Comprehensive Guide", 
            pages: 25,
            outline: [
                {"level": "H1", "text": "1. Introduction to Machine Learning", "page": 1},
                {"level": "H2", "text": "1.1 What is Machine Learning?", "page": 1},
                {"level": "H2", "text": "1.2 Types of Machine Learning", "page": 3},
                {"level": "H3", "text": "1.2.1 Supervised Learning", "page": 4},
                {"level": "H3", "text": "1.2.2 Unsupervised Learning", "page": 6},
                {"level": "H3", "text": "1.2.3 Reinforcement Learning", "page": 8},
                {"level": "H1", "text": "2. Data Preprocessing", "page": 10},
                {"level": "H2", "text": "2.1 Data Cleaning", "page": 11},
                {"level": "H2", "text": "2.2 Feature Engineering", "page": 13},
                {"level": "H3", "text": "2.2.1 Feature Selection", "page": 14},
                {"level": "H3", "text": "2.2.2 Feature Scaling", "page": 16},
                {"level": "H1", "text": "3. Model Training", "page": 18},
                {"level": "H2", "text": "3.1 Algorithm Selection", "page": 19},
                {"level": "H2", "text": "3.2 Hyperparameter Tuning", "page": 21},
                {"level": "H1", "text": "4. Model Evaluation", "page": 23},
                {"level": "H2", "text": "4.1 Metrics and Validation", "page": 24}
            ]
        };

        this.initialize();
    }

    initialize() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.initializeElements();
        this.attachEventListeners();
        console.log('PDF Outline Extractor initialized');
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseBtn = document.getElementById('browseBtn');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileStats = document.getElementById('fileStats');
        this.extractBtn = document.getElementById('extractBtn');
        this.sampleBtn = document.getElementById('sampleBtn');

        // Validation elements
        this.validationStatus = document.getElementById('validationStatus');
        this.fileTypeStatus = document.getElementById('fileTypeStatus');
        this.pageCountStatus = document.getElementById('pageCountStatus');
        this.fileSizeStatus = document.getElementById('fileSizeStatus');

        // Processing elements
        this.processingSection = document.getElementById('processingSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.processingSteps = document.getElementById('processingSteps');
        this.processingTime = document.getElementById('processingTime');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.documentTitle = document.getElementById('documentTitle');
        this.metaFilename = document.getElementById('metaFilename');
        this.metaPages = document.getElementById('metaPages');
        this.metaTime = document.getElementById('metaTime');
        this.metaHeadings = document.getElementById('metaHeadings');
        this.metaLevels = document.getElementById('metaLevels');
        this.outlineContainer = document.getElementById('outlineContainer');
        this.jsonOutput = document.getElementById('jsonOutput');

        // Action buttons
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.expandAllBtn = document.getElementById('expandAllBtn');
        this.collapseAllBtn = document.getElementById('collapseAllBtn');
        this.formatJsonBtn = document.getElementById('formatJsonBtn');
        this.minifyJsonBtn = document.getElementById('minifyJsonBtn');

        // Algorithm toggle
        this.algorithmToggle = document.getElementById('algorithmToggle');
        this.algorithmContent = document.getElementById('algorithmContent');
    }

    attachEventListeners() {
        // File upload events
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            this.uploadArea.addEventListener('drop', this.handleFileDrop.bind(this));
            this.uploadArea.addEventListener('click', () => {
                if (this.fileInput) this.fileInput.click();
            });
        }
        
        if (this.browseBtn) {
            this.browseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.fileInput) this.fileInput.click();
            });
        }
        
        if (this.fileInput) {
            this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        if (this.extractBtn) {
            this.extractBtn.addEventListener('click', this.startExtraction.bind(this));
        }

        if (this.sampleBtn) {
            this.sampleBtn.addEventListener('click', this.useSampleData.bind(this));
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', this.cancelProcessingHandler.bind(this));
        }

        // Results actions
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
        }

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', this.downloadJSON.bind(this));
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', this.resetApplication.bind(this));
        }

        if (this.expandAllBtn) {
            this.expandAllBtn.addEventListener('click', () => this.toggleAllOutlineItems(true));
        }

        if (this.collapseAllBtn) {
            this.collapseAllBtn.addEventListener('click', () => this.toggleAllOutlineItems(false));
        }

        if (this.formatJsonBtn) {
            this.formatJsonBtn.addEventListener('click', () => this.formatJson(true));
        }

        if (this.minifyJsonBtn) {
            this.minifyJsonBtn.addEventListener('click', () => this.formatJson(false));
        }

        // Algorithm toggle
        if (this.algorithmToggle) {
            this.algorithmToggle.addEventListener('click', this.toggleAlgorithm.bind(this));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        console.log('Processing file:', file.name);
        
        // Reset previous states
        this.clearMessages();
        this.hideValidationStatus();
        
        // Show validation status section
        this.showValidationStatus();

        try {
            // Validate file type
            await this.validateFileType(file);
            
            // Validate file size 
            await this.validateFileSize(file);
            
            // Validate page count (most important constraint)
            await this.validatePageCount(file);
            
            // If all validations pass, set the file and show info
            this.currentFile = file;
            this.showFileInfo();
            
        } catch (error) {
            console.error('File validation failed:', error);
            this.showError(error.message);
            this.uploadArea.classList.add('error');
        }
    }

    showValidationStatus() {
        if (this.validationStatus) {
            this.validationStatus.style.display = 'block';
            // Reset all statuses
            this.fileTypeStatus.textContent = 'Checking...';
            this.fileTypeStatus.className = 'validation-result';
            this.pageCountStatus.textContent = 'Checking...';
            this.pageCountStatus.className = 'validation-result';
            this.fileSizeStatus.textContent = 'Checking...';
            this.fileSizeStatus.className = 'validation-result';
        }
    }

    hideValidationStatus() {
        if (this.validationStatus) {
            this.validationStatus.style.display = 'none';
        }
    }

    async validateFileType(file) {
        if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
            this.fileTypeStatus.textContent = '❌ Invalid (PDF required)';
            this.fileTypeStatus.className = 'validation-result error';
            throw new Error('Invalid file type. Please select a PDF file.');
        }
        
        this.fileTypeStatus.textContent = '✅ Valid PDF';
        this.fileTypeStatus.className = 'validation-result success';
    }

    async validateFileSize(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB limit
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        
        if (file.size > maxSize) {
            this.fileSizeStatus.textContent = `❌ ${sizeInMB} MB (>10MB)`;
            this.fileSizeStatus.className = 'validation-result error';
            throw new Error(`File size (${sizeInMB} MB) exceeds 10MB limit.`);
        }
        
        this.fileSizeStatus.textContent = `✅ ${sizeInMB} MB`;
        this.fileSizeStatus.className = 'validation-result success';
    }

    async validatePageCount(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const pageCount = pdf.numPages;
            
            // STRICT 50-PAGE VALIDATION
            if (pageCount > 50) {
                this.pageCountStatus.textContent = `❌ ${pageCount} pages (>50)`;
                this.pageCountStatus.className = 'validation-result error';
                throw new Error(`Error: PDF exceeds 50-page limit. Current pages: ${pageCount}. Please use a smaller document.`);
            }
            
            this.currentPDF = pdf;
            this.pageCountStatus.textContent = `✅ ${pageCount} pages`;
            this.pageCountStatus.className = 'validation-result success';
            
        } catch (error) {
            if (error.message.includes('50-page limit')) {
                throw error; // Re-throw our custom validation error
            }
            
            this.pageCountStatus.textContent = '❌ Cannot read PDF';
            this.pageCountStatus.className = 'validation-result error';
            throw new Error('Failed to read PDF file. The file may be corrupted.');
        }
    }

    showFileInfo() {
        if (this.currentFile && this.currentPDF) {
            const sizeInMB = (this.currentFile.size / (1024 * 1024)).toFixed(2);
            this.fileName.textContent = this.currentFile.name;
            this.fileStats.textContent = `${this.currentPDF.numPages} pages • ${sizeInMB} MB`;
        }
        
        // Show the file info section and enable extract button
        if (this.fileInfo) {
            this.fileInfo.style.display = 'flex';
        }
        
        if (this.extractBtn) {
            this.extractBtn.disabled = false;
        }
        
        // Update upload area to show success state
        this.updateUploadAreaSuccess();
        
        this.showSuccess('PDF validated successfully! Ready for processing.');
    }

    updateUploadAreaSuccess() {
        if (this.uploadArea) {
            this.uploadArea.classList.remove('error');
            this.uploadArea.classList.add('success');
            this.uploadArea.innerHTML = `
                <div class="upload-content">
                    <div class="upload-icon">✅</div>
                    <p class="upload-text">PDF Ready for Processing</p>
                    <p class="upload-subtext">${this.fileName ? this.fileName.textContent : 'File loaded successfully'}</p>
                </div>
            `;
        }
    }

    useSampleData() {
        console.log('Loading sample data');
        
        // Clear previous states
        this.clearMessages();
        this.currentFile = null;
        this.currentPDF = null;
        
        // Show validation status with sample data
        this.showValidationStatus();
        this.fileTypeStatus.textContent = '✅ Valid PDF (Sample)';
        this.fileTypeStatus.className = 'validation-result success';
        this.pageCountStatus.textContent = `✅ ${this.sampleData.pages} pages`;
        this.pageCountStatus.className = 'validation-result success';
        this.fileSizeStatus.textContent = '✅ 2.4 MB (Sample)';
        this.fileSizeStatus.className = 'validation-result success';
        
        // Set sample file info
        if (this.fileName) {
            this.fileName.textContent = this.sampleData.filename;
        }
        if (this.fileStats) {
            this.fileStats.textContent = `${this.sampleData.pages} pages • 2.4 MB (Sample Data)`;
        }
        
        // Show file info and enable extract button
        if (this.fileInfo) {
            this.fileInfo.style.display = 'flex';
        }
        
        if (this.extractBtn) {
            this.extractBtn.disabled = false;
        }
        
        // Update upload area
        this.updateUploadAreaSuccess();
        
        this.showSuccess('Sample data loaded successfully! Click "Extract Outline" to proceed.');
    }

    async startExtraction() {
        if (this.isProcessing) return;

        // Check if we have data to process
        if (!this.currentFile && !this.sampleData) {
            this.showError('No file selected. Please upload a PDF or use sample data.');
            return;
        }

        this.isProcessing = true;
        this.cancelProcessing = false;
        this.processingStartTime = Date.now();
        
        console.log('Starting extraction process');
        
        try {
            this.showProcessingSection();
            this.startProcessingTimer();
            
            if (this.currentFile && this.currentPDF) {
                await this.extractFromRealPDF();
            } else {
                await this.simulateProcessingWithSampleData();
            }
            
            if (!this.cancelProcessing) {
                this.showResults();
            }
            
        } catch (error) {
            console.error('Processing failed:', error);
            if (!this.cancelProcessing) {
                this.showError(`Processing failed: ${error.message}`);
            }
        } finally {
            this.isProcessing = false;
            this.stopProcessingTimer();
        }
    }

    async extractFromRealPDF() {
        const steps = [
            { id: 'step1', text: 'Validating PDF structure...' },
            { id: 'step2', text: 'Extracting text and formatting...' },
            { id: 'step3', text: 'Analyzing headings...' },
            { id: 'step4', text: 'Generating outline...' }
        ];

        let extractedText = [];
        
        for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
            if (this.cancelProcessing) break;
            
            const step = steps[stepIndex];
            this.setStepActive(step.id);
            
            switch (stepIndex) {
                case 0: // PDF Structure validation
                    await this.delay(300);
                    break;
                    
                case 1: // Text extraction
                    extractedText = await this.extractTextFromPDF();
                    break;
                    
                case 2: // Heading analysis
                    await this.delay(500);
                    break;
                    
                case 3: // Outline generation
                    this.processingResults = this.generateOutlineFromText(extractedText);
                    break;
            }
            
            this.setStepCompleted(step.id);
            this.updateProgress((stepIndex + 1) / steps.length * 100);
        }
    }

    async extractTextFromPDF() {
        const textItems = [];
        
        for (let pageNum = 1; pageNum <= this.currentPDF.numPages; pageNum++) {
            if (this.cancelProcessing) break;
            
            const page = await this.currentPDF.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            textContent.items.forEach(item => {
                textItems.push({
                    text: item.str,
                    page: pageNum,
                    fontSize: item.height || 12,
                    fontName: item.fontName || 'default',
                    x: item.transform[4],
                    y: item.transform[5]
                });
            });
        }
        
        return textItems;
    }

    generateOutlineFromText(textItems) {
        // Simple heading detection algorithm
        const fontSizes = textItems.map(item => item.fontSize);
        const avgFontSize = fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length;
        const maxFontSize = Math.max(...fontSizes);
        
        // Thresholds for heading levels
        const h1Threshold = avgFontSize + (maxFontSize - avgFontSize) * 0.7;
        const h2Threshold = avgFontSize + (maxFontSize - avgFontSize) * 0.4;
        const h3Threshold = avgFontSize + (maxFontSize - avgFontSize) * 0.2;
        
        const outline = [];
        let title = this.currentFile ? this.currentFile.name.replace('.pdf', '') : 'Document';
        
        // Find potential title (largest font on first page)
        const firstPageItems = textItems.filter(item => item.page === 1);
        const titleCandidate = firstPageItems.find(item => item.fontSize === maxFontSize);
        if (titleCandidate && titleCandidate.text.length > 5 && titleCandidate.text.length < 100) {
            title = titleCandidate.text;
        }
        
        // Extract headings
        textItems.forEach(item => {
            if (item.text.length < 5 || item.text.length > 200) return;
            
            let level = null;
            if (item.fontSize >= h1Threshold) level = 'H1';
            else if (item.fontSize >= h2Threshold) level = 'H2';
            else if (item.fontSize >= h3Threshold) level = 'H3';
            
            if (level && this.isLikelyHeading(item.text)) {
                outline.push({
                    level: level,
                    text: item.text.trim(),
                    page: item.page
                });
            }
        });
        
        const processingTime = ((Date.now() - this.processingStartTime) / 1000).toFixed(1);
        
        return {
            title: title,
            filename: this.currentFile.name,
            pages: this.currentPDF.numPages,
            processing_time: `${processingTime} seconds`,
            outline: outline.slice(0, 50) // Limit to 50 headings
        };
    }

    isLikelyHeading(text) {
        // Simple heuristics for heading detection
        const headingPatterns = [
            /^\d+\.\s/, // Numbered (1. )
            /^\d+\.\d+\s/, // Sub-numbered (1.1 )
            /^[A-Z][^a-z]*$/, // All caps
            /^(Chapter|Section|Part|Introduction|Conclusion|Abstract|Summary)/i,
            /^\w+:?\s*$/ // Single word or short phrase
        ];
        
        return headingPatterns.some(pattern => pattern.test(text)) ||
               (text.length < 60 && text.split(' ').length <= 8);
    }

    async simulateProcessingWithSampleData() {
        const steps = [
            { id: 'step1', text: 'Validating PDF structure...' },
            { id: 'step2', text: 'Extracting text and formatting...' },
            { id: 'step3', text: 'Analyzing headings...' },
            { id: 'step4', text: 'Generating outline...' }
        ];

        for (let i = 0; i < steps.length; i++) {
            if (this.cancelProcessing) break;
            
            const step = steps[i];
            this.setStepActive(step.id);
            
            // Simulate processing time
            await this.delay(600 + Math.random() * 400);
            
            this.setStepCompleted(step.id);
            this.updateProgress((i + 1) / steps.length * 100);
        }
        
        if (!this.cancelProcessing) {
            const processingTime = ((Date.now() - this.processingStartTime) / 1000).toFixed(1);
            this.processingResults = {
                ...this.sampleData,
                processing_time: `${processingTime} seconds`
            };
        }
    }

    showProcessingSection() {
        if (this.processingSection) {
            this.processingSection.style.display = 'block';
            this.processingSection.classList.add('fade-in');
            
            // Reset processing state
            this.updateProgress(0);
            this.resetProcessingSteps();
            
            setTimeout(() => {
                this.processingSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    resetProcessingSteps() {
        const steps = ['step1', 'step2', 'step3', 'step4'];
        steps.forEach(stepId => {
            const stepElement = document.getElementById(stepId);
            if (stepElement) {
                stepElement.classList.remove('active', 'completed');
                const indicator = stepElement.querySelector('.step-indicator');
                if (indicator) indicator.textContent = '⏳';
            }
        });
    }

    setStepActive(stepId) {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.add('active');
            const indicator = stepElement.querySelector('.step-indicator');
            if (indicator) indicator.textContent = '🔄';
        }
    }

    setStepCompleted(stepId) {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            const indicator = stepElement.querySelector('.step-indicator');
            if (indicator) indicator.textContent = '✅';
        }
    }

    updateProgress(percentage) {
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(percentage)}%`;
        }
    }

    startProcessingTimer() {
        this.processingTimer = setInterval(() => {
            if (this.processingStartTime && this.processingTime) {
                const elapsed = ((Date.now() - this.processingStartTime) / 1000).toFixed(1);
                this.processingTime.textContent = `${elapsed}s`;
                
                // Auto-cancel if exceeding 10 seconds
                if (elapsed > 10) {
                    this.cancelProcessingHandler();
                }
            }
        }, 100);
    }

    stopProcessingTimer() {
        if (this.processingTimer) {
            clearInterval(this.processingTimer);
            this.processingTimer = null;
        }
    }

    cancelProcessingHandler() {
        this.cancelProcessing = true;
        this.isProcessing = false;
        this.stopProcessingTimer();
        
        if (this.processingSection) {
            this.processingSection.style.display = 'none';
        }
        
        this.showWarning('Processing cancelled by user.');
        console.log('Processing cancelled');
    }

    showResults() {
        if (!this.processingResults) return;
        
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
            this.resultsSection.classList.add('fade-in');

            // Update document title
            if (this.documentTitle) {
                this.documentTitle.textContent = this.processingResults.title;
            }

            // Update metadata
            this.updateResultsMetadata();
            
            // Render outline
            this.renderOutline();

            // Update JSON output
            this.updateJSONOutput();

            setTimeout(() => {
                this.resultsSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    updateResultsMetadata() {
        if (this.metaFilename) this.metaFilename.textContent = this.processingResults.filename || this.processingResults.title;
        if (this.metaPages) this.metaPages.textContent = this.processingResults.pages || this.processingResults.outline.length;
        if (this.metaTime) this.metaTime.textContent = this.processingResults.processing_time;
        if (this.metaHeadings) this.metaHeadings.textContent = this.processingResults.outline.length;
        
        const levels = new Set(this.processingResults.outline.map(item => item.level));
        if (this.metaLevels) this.metaLevels.textContent = Array.from(levels).sort().join(', ');
    }

    renderOutline() {
        if (!this.outlineContainer) return;
        
        this.outlineContainer.innerHTML = '';
        
        this.processingResults.outline.forEach((item, index) => {
            const outlineItem = document.createElement('div');
            outlineItem.className = `outline-item ${item.level.toLowerCase()}`;
            
            outlineItem.innerHTML = `
                <span class="outline-level">${item.level}</span>
                <span class="outline-text">${this.escapeHtml(item.text)}</span>
                <span class="outline-page">Page ${item.page}</span>
            `;
            
            this.outlineContainer.appendChild(outlineItem);
            
            // Add slide-in animation
            setTimeout(() => {
                outlineItem.classList.add('slide-in');
            }, index * 50);
        });
    }

    updateJSONOutput() {
        if (!this.jsonOutput || !this.processingResults) return;
        
        const jsonData = {
            title: this.processingResults.title,
            outline: this.processingResults.outline
        };

        this.formatJsonOutput(jsonData, true);
    }

    formatJsonOutput(data, formatted = true) {
        const jsonString = formatted ? 
            JSON.stringify(data, null, 2) : 
            JSON.stringify(data);
            
        this.jsonOutput.innerHTML = `<code>${this.syntaxHighlight(jsonString)}</code>`;
    }

    syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            function (match) {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="json-' + cls + '">' + match + '</span>';
            });
    }

    async copyToClipboard() {
        if (!this.processingResults) {
            this.showError('No results to copy. Please process a file first.');
            return;
        }

        const jsonData = {
            title: this.processingResults.title,
            outline: this.processingResults.outline
        };

        try {
            await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
            
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ Copied!';
            this.copyBtn.style.backgroundColor = 'var(--color-success)';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.backgroundColor = '';
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            this.showError('Failed to copy to clipboard. Please try again.');
        }
    }

    downloadJSON() {
        if (!this.processingResults) {
            this.showError('No results to download. Please process a file first.');
            return;
        }

        const jsonData = {
            title: this.processingResults.title,
            outline: this.processingResults.outline
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.getSafeFilename(this.processingResults.title)}_outline.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    getSafeFilename(title) {
        return title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    toggleAllOutlineItems(expand) {
        // This would be for collapsible outline items - placeholder for now
        console.log(`${expand ? 'Expanding' : 'Collapsing'} all outline items`);
    }

    formatJson(formatted) {
        if (!this.processingResults) return;
        
        const jsonData = {
            title: this.processingResults.title,
            outline: this.processingResults.outline
        };
        
        this.formatJsonOutput(jsonData, formatted);
    }

    resetApplication() {
        // Reset all states
        this.currentFile = null;
        this.currentPDF = null;
        this.processingResults = null;
        this.isProcessing = false;
        this.cancelProcessing = false;
        this.processingStartTime = null;
        this.stopProcessingTimer();
        
        // Clear form
        if (this.fileInput) this.fileInput.value = '';
        
        // Hide sections
        this.hideValidationStatus();
        if (this.fileInfo) this.fileInfo.style.display = 'none';
        if (this.processingSection) this.processingSection.style.display = 'none';
        if (this.resultsSection) this.resultsSection.style.display = 'none';
        
        // Reset upload area
        this.resetUploadArea();
        
        // Clear messages
        this.clearMessages();
        
        // Reset button states
        if (this.extractBtn) this.extractBtn.disabled = true;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('Application reset');
    }

    resetUploadArea() {
        if (this.uploadArea) {
            this.uploadArea.classList.remove('success', 'error');
            this.uploadArea.innerHTML = `
                <div class="upload-content">
                    <div class="upload-icon">📄</div>
                    <p class="upload-text">Drag and drop your PDF here</p>
                    <p class="upload-subtext">or</p>
                    <button class="btn btn--primary" id="browseBtn">Browse Files</button>
                    <input type="file" id="fileInput" accept=".pdf" hidden>
                </div>
                <div class="upload-requirements">
                    <p><strong>Requirements:</strong> PDF format, ≤50 pages, ≤10MB</p>
                    <p><strong>Note:</strong> Files exceeding 50 pages will be rejected</p>
                </div>
            `;
        }
        
        // Reinitialize elements and event listeners
        setTimeout(() => {
            this.initializeElements();
            this.attachEventListeners();
        }, 100);
    }

    toggleAlgorithm() {
        if (!this.algorithmContent || !this.algorithmToggle) return;
        
        const isExpanded = this.algorithmContent.style.display === 'block';
        
        if (isExpanded) {
            this.algorithmContent.style.display = 'none';
            this.algorithmToggle.innerHTML = 'Show Algorithm Details <span class="toggle-icon">▼</span>';
            this.algorithmToggle.classList.remove('expanded');
        } else {
            this.algorithmContent.style.display = 'block';
            this.algorithmToggle.innerHTML = 'Hide Algorithm Details <span class="toggle-icon">▲</span>';
            this.algorithmToggle.classList.add('expanded');
        }
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearMessages() {
        const existingMessages = document.querySelectorAll('.status-message');
        existingMessages.forEach(message => message.remove());
    }

    showMessage(message, type = 'info') {
        this.clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message status-message--${type} fade-in`;
        
        const icon = type === 'success' ? '✅' : 
                    type === 'error' ? '❌' : 
                    type === 'warning' ? '⚠️' : 'ℹ️';
        
        messageDiv.innerHTML = `
            <span>${icon}</span>
            <span>${message}</span>
        `;
        
        const container = this.uploadArea?.parentNode || document.querySelector('.upload-section .card__body');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            
            // Auto-remove after 5 seconds for non-error messages
            if (type !== 'error') {
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 5000);
            }
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showWarning(message) {
        this.showMessage(message, 'warning');
    }
}

// Initialize application when page loads
const app = new PDFOutlineExtractor();
console.log('PDF Outline Extractor application loaded');